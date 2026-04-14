import { describe, expect, it } from "vitest";

import {
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
