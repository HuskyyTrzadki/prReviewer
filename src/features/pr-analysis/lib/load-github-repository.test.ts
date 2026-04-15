import { describe, expect, it } from "vitest";

import type { GithubApiClient } from "@/features/pr-analysis/lib/github-api-client";
import { getGithubAuthToken } from "@/features/pr-analysis/lib/github-api-client";
import { loadGithubRepository } from "@/features/pr-analysis/lib/load-github-repository";

const repository = {
  owner: "vercel",
  repo: "next.js",
  fullName: "vercel/next.js",
  canonicalUrl: "https://github.com/vercel/next.js",
} as const;

const createClient = (
  getRepository: GithubApiClient["getRepository"],
): GithubApiClient => ({
  getRepository,
});

describe("loadGithubRepository", () => {
  it("normalizes a public github repository", async () => {
    const result = await loadGithubRepository(
      repository,
      createClient(async () => ({
        defaultBranch: "canary",
        fullName: "vercel/next.js",
        isPrivate: false,
        ownerLogin: "vercel",
        repoName: "next.js",
      })),
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
      repository,
      createClient(async () => ({
        defaultBranch: "main",
        fullName: "vercel/next.js",
        isPrivate: true,
        ownerLogin: "vercel",
        repoName: "next.js",
      })),
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

  it("maps github 404 responses to a typed repository error", async () => {
    const result = await loadGithubRepository(
      repository,
      createClient(async () => {
        const error = new Error("Not Found") as Error & { status: number };
        error.status = 404;
        throw error;
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

  it("maps github rate limits to a typed error", async () => {
    const result = await loadGithubRepository(
      repository,
      createClient(async () => {
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

  it("maps unknown github failures to an upstream error", async () => {
    const result = await loadGithubRepository(
      repository,
      createClient(async () => {
        throw new Error("Boom");
      }),
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "GITHUB_UPSTREAM_ERROR",
        message: "GitHub could not be reached right now. Try again in a moment.",
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
