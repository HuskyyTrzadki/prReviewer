import { describe, expect, it } from "vitest";

import {
  llmPullRequestScoreSchema,
  scoredRepositoryAnalysisSchema,
} from "@/features/pr-analysis/contracts/scoring-contracts";

describe("scoring contracts", () => {
  it("accepts a raw LLM pull request scoring payload", () => {
    const payload = {
      summary: "Substantial infra improvement with moderate implementation complexity.",
      impact: {
        score: 82,
        rationale: "Improves a core contributor workflow.",
      },
      aiLeverage: {
        score: 54,
        rationale: "The diff shows some repetitive code generation patterns.",
      },
      quality: {
        score: 88,
        rationale: "Changes are focused and backed by clear intent.",
      },
    };

    expect(llmPullRequestScoreSchema.parse(payload)).toEqual(payload);
  });

  it("accepts scored repository analysis data with skipped pull requests", () => {
    const payload = {
      repository: {
        owner: "vercel",
        repo: "next.js",
        fullName: "vercel/next.js",
        canonicalUrl: "https://github.com/vercel/next.js",
      },
      summary: {
        impactScore: 80,
        aiLeverageScore: 58,
        qualityScore: 85,
        overallScore: 76,
        scoredPullRequestCount: 2,
        skippedPullRequestCount: 1,
      },
      pullRequests: [
        {
          number: 1001,
          title: "Improve cache invalidation",
          body: "Adds clearer tagging for cache updates.",
          authorLogin: "leerob",
          htmlUrl: "https://github.com/vercel/next.js/pull/1001",
          mergedAt: "2026-04-14T19:00:00.000Z",
          additions: 42,
          deletions: 9,
          changedFiles: 3,
          summary: "Useful infrastructure refinement with focused scope.",
          impactScore: 78,
          impactRationale: "Improves a shared platform behavior.",
          aiLeverageScore: 51,
          aiLeverageRationale: "Some patterns suggest assisted drafting, but evidence is mixed.",
          qualityScore: 87,
          qualityRationale: "The change is cohesive and readable.",
          overallScore: 74,
        },
      ],
      skippedPullRequests: [
        {
          number: 1002,
          reason: "LLM_INVALID_OUTPUT",
        },
      ],
    };

    expect(scoredRepositoryAnalysisSchema.parse(payload)).toEqual(payload);
  });

  it("rejects scores outside the agreed range", () => {
    const payload = {
      summary: "Some summary",
      impact: {
        score: 120,
        rationale: "Too high.",
      },
      aiLeverage: {
        score: 40,
        rationale: "Looks reasonable.",
      },
      quality: {
        score: 55,
        rationale: "Looks reasonable.",
      },
    };

    expect(() => llmPullRequestScoreSchema.parse(payload)).toThrow();
  });
});
