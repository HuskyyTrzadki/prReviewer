import { describe, expect, it } from "vitest";

import {
  githubRateLimitedMessage,
  githubUpstreamErrorMessage,
  repositoryNotFoundOrPrivateMessage,
} from "@/features/pr-analysis/lib/analysis-api-errors";
import { getGithubAuthToken } from "@/features/pr-analysis/lib/github-api-client";
import { loadGithubRepository } from "@/features/pr-analysis/lib/load-github-repository";
import {
  createGithubApiClientMock,
  createGithubRepositoryRecord,
  createGithubRequestError,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

describe("loadGithubRepository", () => {
  it("normalizes a public github repository", async () => {
    const result = await loadGithubRepository(
      testRepository,
      createGithubApiClientMock({
        getRepository: async () =>
          createGithubRepositoryRecord({
            defaultBranch: "canary",
          }),
      }),
    );

    expect(result).toEqual({
      ok: true,
      value: {
        owner: "vercel",
        repo: "next.js",
        fullName: "vercel/next.js",
        canonicalUrl: "https://github.com/vercel/next.js",
        defaultBranch: "canary",
      },
    });
  });

  it("rejects private repositories", async () => {
    const result = await loadGithubRepository(
      testRepository,
      createGithubApiClientMock({
        getRepository: async () =>
          createGithubRepositoryRecord({
            isPrivate: true,
          }),
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

  it("maps github 404 responses to a typed repository error", async () => {
    const result = await loadGithubRepository(
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

  it("maps github rate limits to a typed error", async () => {
    const result = await loadGithubRepository(
      testRepository,
      createGithubApiClientMock({
        getRepository: async () => {
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

  it("maps unknown github failures to an upstream error", async () => {
    const result = await loadGithubRepository(
      testRepository,
      createGithubApiClientMock({
        getRepository: async () => {
          throw new Error("Boom");
        },
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "GITHUB_UPSTREAM_ERROR",
        message: githubUpstreamErrorMessage,
      },
    });
  });
});

describe("getGithubAuthToken", () => {
  it("returns a trimmed token value when present", () => {
    expect(getGithubAuthToken("  secret-token  ")).toBe("secret-token");
  });

  it("returns undefined when the token is blank", () => {
    expect(getGithubAuthToken("   ")).toBeUndefined();
  });
});
