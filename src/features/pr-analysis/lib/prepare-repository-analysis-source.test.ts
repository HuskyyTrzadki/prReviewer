import { describe, expect, it } from "vitest";

import type { GithubApiClient } from "@/features/pr-analysis/lib/github-api-client";
import { prepareRepositoryAnalysisSource } from "@/features/pr-analysis/lib/prepare-repository-analysis-source";

const repository = {
  owner: "vercel",
  repo: "next.js",
  fullName: "vercel/next.js",
  canonicalUrl: "https://github.com/vercel/next.js",
} as const;

const createClient = ({
  getRepository,
  getPullRequest,
  listClosedPullRequests,
}: GithubApiClient): GithubApiClient => ({
  getRepository,
  getPullRequest,
  listClosedPullRequests,
});

describe("prepareRepositoryAnalysisSource", () => {
  it("returns the repository and merged pull requests in one normalized payload", async () => {
    const result = await prepareRepositoryAnalysisSource(
      repository,
      createClient({
        getRepository: async () => ({
          defaultBranch: "canary",
          fullName: "vercel/next.js",
          isPrivate: false,
          ownerLogin: "vercel",
          repoName: "next.js",
        }),
        listClosedPullRequests: async (_owner, _repo, page) =>
          page === 1 ? [{ number: 11, mergedAt: "2026-04-14T19:00:00.000Z" }] : [],
        getPullRequest: async () => ({
          number: 11,
          title: "Improve cache hints",
          body: "Refines cache usage.",
          authorLogin: "leerob",
          htmlUrl: "https://github.com/vercel/next.js/pull/11",
          mergedAt: "2026-04-14T19:00:00.000Z",
          additions: 10,
          deletions: 2,
          changedFiles: 1,
        }),
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        repository: {
          owner: "vercel",
          repo: "next.js",
          fullName: "vercel/next.js",
          canonicalUrl: "https://github.com/vercel/next.js",
          defaultBranch: "canary",
        },
        pullRequests: [
          {
            number: 11,
            title: "Improve cache hints",
            body: "Refines cache usage.",
            authorLogin: "leerob",
            htmlUrl: "https://github.com/vercel/next.js/pull/11",
            mergedAt: "2026-04-14T19:00:00.000Z",
            additions: 10,
            deletions: 2,
            changedFiles: 1,
          },
        ],
        requestedPullRequestLimit: 20,
      },
    });
  });

  it("returns upstream errors without changing them", async () => {
    const result = await prepareRepositoryAnalysisSource(
      repository,
      createClient({
        getRepository: async () => {
          const error = new Error("Not Found") as Error & { status: number };
          error.status = 404;
          throw error;
        },
        listClosedPullRequests: async () => [],
        getPullRequest: async () => ({
          number: 11,
          title: "Unused",
          body: "",
          authorLogin: "leerob",
          htmlUrl: "https://github.com/vercel/next.js/pull/11",
          mergedAt: "2026-04-14T19:00:00.000Z",
          additions: 0,
          deletions: 0,
          changedFiles: 0,
        }),
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
        message:
          "This repository was not found or is private. Use a public GitHub repository URL.",
      },
    });
  });
});
