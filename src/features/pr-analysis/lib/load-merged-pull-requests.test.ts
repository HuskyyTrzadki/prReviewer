import { describe, expect, it } from "vitest";

import {
  githubRateLimitedMessage,
  githubUpstreamErrorMessage,
  noMergedPullRequestsMessage,
} from "@/features/pr-analysis/lib/analysis-api-errors";
import type {
  GithubClosedPullRequestListItem,
} from "@/features/pr-analysis/lib/github-api-client";
import { loadMergedPullRequests } from "@/features/pr-analysis/lib/load-merged-pull-requests";
import {
  createGithubApiClientMock,
  createGithubPullRequestRecord,
  createGithubRequestError,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

describe("loadMergedPullRequests", () => {
  it("collects merged pull requests across pages until the limit is reached", async () => {
    const listCalls: number[] = [];
    const detailCalls: number[] = [];

    const result = await loadMergedPullRequests(
      testRepository,
      createGithubApiClientMock({
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
          return createGithubPullRequestRecord(pullNumber);
        },
      }),
      3,
    );

    expect(listCalls).toEqual([1, 2]);
    expect(detailCalls).toEqual([1, 3, 4]);
    expect(result).toEqual({
      ok: true,
      value: [
        createGithubPullRequestRecord(1),
        createGithubPullRequestRecord(3),
        createGithubPullRequestRecord(4),
      ],
    });
  });

  it("returns a typed error when no merged pull requests exist", async () => {
    const result = await loadMergedPullRequests(
      testRepository,
      createGithubApiClientMock({
        listClosedPullRequests: async (_owner, _repo, page) =>
          page === 1 ? [{ number: 1, mergedAt: null }] : [],
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "NO_MERGED_PULL_REQUESTS",
        message: noMergedPullRequestsMessage,
      },
    });
  });

  it("normalizes null authors and empty bodies from github", async () => {
    const result = await loadMergedPullRequests(
      testRepository,
      createGithubApiClientMock({
        listClosedPullRequests: async () => [
          { number: 7, mergedAt: "2026-04-14T19:00:00.000Z" },
        ],
        getPullRequest: async () =>
          createGithubPullRequestRecord(7, {
            authorLogin: null,
            body: "",
          }),
      }),
      1,
    );

    expect(result).toEqual({
      ok: true,
      value: [
        createGithubPullRequestRecord(7, {
          authorLogin: null,
          body: "",
        }),
      ],
    });
  });

  it("returns an upstream error when github returns an unmerged pull request detail", async () => {
    const result = await loadMergedPullRequests(
      testRepository,
      createGithubApiClientMock({
        listClosedPullRequests: async () => [
          { number: 7, mergedAt: "2026-04-14T19:00:00.000Z" },
        ],
        getPullRequest: async () =>
          createGithubPullRequestRecord(7, {
            mergedAt: null,
          }),
      }),
      1,
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "GITHUB_UPSTREAM_ERROR",
        message: githubUpstreamErrorMessage,
      },
    });
  });

  it("maps github api failures to typed errors", async () => {
    const result = await loadMergedPullRequests(
      testRepository,
      createGithubApiClientMock({
        listClosedPullRequests: async () => {
          throw createGithubRequestError("Rate limited", {
            status: 403,
            response: {
              headers: {
                "x-ratelimit-remaining": "0",
              },
            },
          });
        },
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "GITHUB_RATE_LIMITED",
        message: githubRateLimitedMessage,
      },
    });
  });
});
