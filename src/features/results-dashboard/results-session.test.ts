import { describe, expect, it } from "vitest";

import type { AnalyzeRepositorySuccess } from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  createAnalysisResultStorageKey,
  readAnalysisResult,
  storeAnalysisResult,
} from "@/features/results-dashboard/results-session";

const createStorage = () => {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => {
      values.delete(key);
    },
    setItem: (key: string, value: string) => {
      values.set(key, value);
    },
  };
};

const analysisResultFixture: AnalyzeRepositorySuccess = {
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

describe("resultsSession", () => {
  it("stores and restores a typed analysis result", () => {
    const storage = createStorage();

    storeAnalysisResult(analysisResultFixture, storage);

    expect(readAnalysisResult("repo_demo", storage)).toEqual({
      status: "success",
      data: analysisResultFixture,
    });
  });

  it("returns empty when no stored analysis result exists", () => {
    expect(readAnalysisResult("repo_missing", createStorage())).toEqual({
      status: "empty",
    });
  });

  it("drops an invalid stored analysis result", () => {
    const storage = createStorage();

    storage.setItem(
      createAnalysisResultStorageKey("repo_demo"),
      JSON.stringify({ status: "success" }),
    );

    expect(readAnalysisResult("repo_demo", storage)).toEqual({
      status: "error",
    });
    expect(storage.getItem(createAnalysisResultStorageKey("repo_demo"))).toBeNull();
  });

  it("drops a stored result when the route repoId does not match", () => {
    const storage = createStorage();

    storeAnalysisResult(analysisResultFixture, storage);

    expect(readAnalysisResult("repo_other", storage)).toEqual({
      status: "empty",
    });
  });
});
