import { describe, expect, it } from "vitest";

import { githubRateLimitedMessage } from "@/features/pr-analysis/lib/analysis-api-errors";
import { loadPullRequestFiles } from "@/features/pr-analysis/lib/load-pull-request-files";
import {
  createGithubApiClientMock,
  createGithubPullRequestFileRecord,
  createGithubRequestError,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

describe("loadPullRequestFiles", () => {
  it("returns normalized changed file data for one pull request", async () => {
    const result = await loadPullRequestFiles(
      testRepository,
      11,
      createGithubApiClientMock({
        listPullRequestFiles: async () => [
          createGithubPullRequestFileRecord("src/app/page.tsx"),
          createGithubPullRequestFileRecord("public/logo.png", {
            patch: null,
            status: "added",
          }),
        ],
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: [
        createGithubPullRequestFileRecord("src/app/page.tsx"),
        createGithubPullRequestFileRecord("public/logo.png", {
          patch: null,
          status: "added",
        }),
      ],
    });
  });

  it("maps github api failures to typed errors", async () => {
    const result = await loadPullRequestFiles(
      testRepository,
      11,
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
