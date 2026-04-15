import { describe, expect, it } from "vitest";

import { githubRateLimitedMessage } from "@/features/pr-analysis/lib/analysis-api-errors";
import { prepareRepositoryScoringSource } from "@/features/pr-analysis/lib/prepare-repository-scoring-source";
import {
  createGithubApiClientMock,
  createGithubPullRequestFileRecord,
  createNormalizedPullRequestSource,
  createGithubRequestError,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

const analysisSource = {
  repository: {
    ...testRepository,
    defaultBranch: "canary",
  },
  pullRequests: Array.from({ length: 10 }, (_, index) =>
    createNormalizedPullRequestSource(index + 1),
  ),
  requestedPullRequestLimit: 20,
};

describe("prepareRepositoryScoringSource", () => {
  it("attaches changed file context for only the scored pull request sample", async () => {
    const fileCalls: number[] = [];

    const result = await prepareRepositoryScoringSource(
      analysisSource,
      createGithubApiClientMock({
        listPullRequestFiles: async (_owner, _repo, pullNumber) => {
          fileCalls.push(pullNumber);

          return [
            createGithubPullRequestFileRecord(`src/pr-${pullNumber}.ts`, {
              additions: pullNumber,
            }),
          ];
        },
      }),
    );

    expect(fileCalls).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(result).toEqual({
      ok: true,
      value: {
        repository: analysisSource.repository,
        pullRequests: analysisSource.pullRequests.slice(0, 8).map((pullRequest) => ({
          ...pullRequest,
          files: [
            createGithubPullRequestFileRecord(`src/pr-${pullRequest.number}.ts`, {
              additions: pullRequest.number,
            }),
          ],
        })),
        requestedPullRequestLimit: 8,
      },
    });
  });

  it("returns typed upstream errors from pull request file loading", async () => {
    const result = await prepareRepositoryScoringSource(
      analysisSource,
      createGithubApiClientMock({
        listPullRequestFiles: async () => {
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
