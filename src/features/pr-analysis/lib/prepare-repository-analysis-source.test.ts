import { describe, expect, it } from "vitest";

import { repositoryNotFoundOrPrivateMessage } from "@/features/pr-analysis/lib/analysis-api-errors";
import { prepareRepositoryAnalysisSource } from "@/features/pr-analysis/lib/prepare-repository-analysis-source";
import {
  createGithubApiClientMock,
  createGithubPullRequestRecord,
  createGithubRepositoryRecord,
  createGithubRequestError,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

describe("prepareRepositoryAnalysisSource", () => {
  it("returns the repository and merged pull requests in one normalized payload", async () => {
    const result = await prepareRepositoryAnalysisSource(
      testRepository,
      createGithubApiClientMock({
        getRepository: async () =>
          createGithubRepositoryRecord({
            defaultBranch: "canary",
          }),
        listClosedPullRequests: async (_owner, _repo, page) =>
          page === 1 ? [{ number: 11, mergedAt: "2026-04-14T19:00:00.000Z" }] : [],
        getPullRequest: async () =>
          createGithubPullRequestRecord(11, {
            title: "Improve cache hints",
            body: "Refines cache usage.",
            authorLogin: "leerob",
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
      testRepository,
      createGithubApiClientMock({
        getRepository: async () => {
          throw createGithubRequestError("Not Found", { status: 404 });
        },
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
        message: repositoryNotFoundOrPrivateMessage,
      },
    });
  });
});
