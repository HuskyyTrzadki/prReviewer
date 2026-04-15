import { describe, expect, it } from "vitest";

import type {
  GithubApiClient,
  GithubClosedPullRequestListItem,
  GithubPullRequestRecord,
} from "@/features/pr-analysis/lib/github-api-client";
import { loadMergedPullRequests } from "@/features/pr-analysis/lib/load-merged-pull-requests";

const repository = {
  owner: "vercel",
  repo: "next.js",
  fullName: "vercel/next.js",
  canonicalUrl: "https://github.com/vercel/next.js",
} as const;

const createClient = ({
  getPullRequest,
  listClosedPullRequests,
}: {
  getPullRequest: GithubApiClient["getPullRequest"];
  listClosedPullRequests: GithubApiClient["listClosedPullRequests"];
}): GithubApiClient => ({
  getRepository: async () => ({
    defaultBranch: "main",
    fullName: "vercel/next.js",
    isPrivate: false,
    ownerLogin: "vercel",
    repoName: "next.js",
  }),
  getPullRequest,
  listClosedPullRequests,
});

const createPullRequestRecord = (
  number: number,
  overrides: Partial<GithubPullRequestRecord> = {},
): GithubPullRequestRecord => ({
  number,
  title: `PR ${number}`,
  body: `Body ${number}`,
  authorLogin: `author-${number}`,
  htmlUrl: `https://github.com/vercel/next.js/pull/${number}`,
  mergedAt: "2026-04-14T19:00:00.000Z",
  additions: number * 2,
  deletions: number,
  changedFiles: 3,
  ...overrides,
});

describe("loadMergedPullRequests", () => {
  it("collects merged pull requests across pages until the limit is reached", async () => {
    const listCalls: number[] = [];
    const detailCalls: number[] = [];

    const result = await loadMergedPullRequests(
      repository,
      createClient({
        listClosedPullRequests: async (_owner, _repo, page) => {
          listCalls.push(page);

          const pages: Record<number, GithubClosedPullRequestListItem[]> = {
            1: [
              { number: 1, mergedAt: "2026-04-14T19:00:00.000Z" },
              { number: 2, mergedAt: null },
            ],
            2: [
              { number: 3, mergedAt: "2026-04-14T19:00:00.000Z" },
              { number: 4, mergedAt: "2026-04-14T19:00:00.000Z" },
            ],
          };

          return pages[page] ?? [];
        },
        getPullRequest: async (_owner, _repo, pullNumber) => {
          detailCalls.push(pullNumber);
          return createPullRequestRecord(pullNumber);
        },
      }),
      3,
    );

    expect(listCalls).toEqual([1, 2]);
    expect(detailCalls).toEqual([1, 3, 4]);
    expect(result).toEqual({
      ok: true,
      value: [
        createPullRequestRecord(1),
        createPullRequestRecord(3),
        createPullRequestRecord(4),
      ],
    });
  });

  it("returns a typed error when no merged pull requests exist", async () => {
    const result = await loadMergedPullRequests(
      repository,
      createClient({
        listClosedPullRequests: async (_owner, _repo, page) =>
          page === 1 ? [{ number: 1, mergedAt: null }] : [],
        getPullRequest: async (owner, repo, pullNumber) =>
          createPullRequestRecord(pullNumber),
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "NO_MERGED_PULL_REQUESTS",
        message: "No merged pull requests were found for this repository.",
      },
    });
  });

  it("normalizes null authors and empty bodies from github", async () => {
    const result = await loadMergedPullRequests(
      repository,
      createClient({
        listClosedPullRequests: async () => [
          { number: 7, mergedAt: "2026-04-14T19:00:00.000Z" },
        ],
        getPullRequest: async () =>
          createPullRequestRecord(7, {
            authorLogin: null,
            body: "",
          }),
      }),
      1,
    );

    expect(result).toEqual({
      ok: true,
      value: [
        createPullRequestRecord(7, {
          authorLogin: null,
          body: "",
        }),
      ],
    });
  });

  it("maps github api failures to typed errors", async () => {
    const result = await loadMergedPullRequests(
      repository,
      createClient({
        listClosedPullRequests: async () => {
          const error = new Error("Rate limited") as Error & {
            response: { headers: Record<string, string> };
            status: number;
          };
          error.status = 403;
          error.response = {
            headers: {
              "x-ratelimit-remaining": "0",
            },
          };
          throw error;
        },
        getPullRequest: async (owner, repo, pullNumber) =>
          createPullRequestRecord(pullNumber),
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "GITHUB_RATE_LIMITED",
        message: "GitHub rate limit was reached. Try again later.",
      },
    });
  });
});
