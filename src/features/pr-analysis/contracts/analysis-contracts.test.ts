import { describe, expect, it } from "vitest";

import {
  analysisApiErrorCodes,
  analysisApiErrorSchema,
  analysisResultSchema,
  analyzeRepositoryResponseSchema,
  analyzeRepositorySuccessSchema,
} from "@/features/pr-analysis/contracts/analysis-contracts";

describe("analysis contracts", () => {
  it("accepts the analyze success payload shape", () => {
    const payload = {
      status: "success",
      repository: {
        owner: "vercel",
        repo: "next.js",
        fullName: "vercel/next.js",
        canonicalUrl: "https://github.com/vercel/next.js",
      },
      repoId: "repo_demo",
      redirectUrl: "/results/repo_demo",
      analysis: {
        summary: {
          impactScore: 80,
          aiLeverageScore: 58,
          qualityScore: 85,
          overallScore: 74,
          scoredPullRequestCount: 1,
          skippedPullRequestCount: 0,
        },
        pullRequests: [],
        skippedPullRequests: [],
      },
    };

    expect(analyzeRepositorySuccessSchema.parse(payload)).toEqual(payload);
    expect(analyzeRepositoryResponseSchema.parse(payload)).toEqual(payload);
  });

  it("accepts the typed API error payload shape", () => {
    const payload = {
      status: "error",
      code: "INVALID_REPOSITORY_URL",
      message: "Enter a valid public GitHub repository URL.",
    };

    expect(analysisApiErrorSchema.parse(payload)).toEqual(payload);
    expect(analyzeRepositoryResponseSchema.parse(payload)).toEqual(payload);
  });

  it("includes step 7 github analysis error codes", () => {
    expect(analysisApiErrorCodes).toEqual([
      "INVALID_REQUEST_BODY",
      "REPOSITORY_NOT_FOUND_OR_PRIVATE",
      "NO_MERGED_PULL_REQUESTS",
      "GITHUB_RATE_LIMITED",
      "GITHUB_UPSTREAM_ERROR",
      "ANALYSIS_FAILED",
      "INVALID_REPOSITORY_URL",
      "UNSUPPORTED_REPOSITORY_HOST",
      "UNSUPPORTED_REPOSITORY_RESOURCE",
    ]);
  });

  it("keeps the future analysis result shell intentionally minimal", () => {
    const payload = {
      repoId: "repo_demo",
      repository: {
        owner: "vercel",
        repo: "next.js",
        fullName: "vercel/next.js",
        canonicalUrl: "https://github.com/vercel/next.js",
      },
      status: "pending",
    };

    expect(analysisResultSchema.parse(payload)).toEqual(payload);
  });
});
