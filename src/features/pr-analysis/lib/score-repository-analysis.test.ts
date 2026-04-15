import { describe, expect, it } from "vitest";

import { createScoredPullRequest, createScoredRepositoryAnalysis } from "@/features/pr-analysis/lib/score-repository-analysis";
import {
  createLlmPullRequestScore,
  createPullRequestScoringSource,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

describe("score repository analysis", () => {
  it("creates a scored pull request with server-side overall score normalization", () => {
    const result = createScoredPullRequest(
      createPullRequestScoringSource(11),
      createLlmPullRequestScore({
        impact: {
          score: 80.4,
          rationale: "High repo-level value.",
        },
        aiLeverage: {
          score: 59.6,
          rationale: "Moderate evidence of assisted generation.",
        },
        quality: {
          score: 90.2,
          rationale: "Focused and clean execution.",
        },
      }),
    );

    expect(result).toMatchObject({
      number: 11,
      impactScore: 80,
      aiLeverageScore: 60,
      qualityScore: 90,
      overallScore: 77,
    });
  });

  it("aggregates repository summary data from scored and skipped pull requests", () => {
    const result = createScoredRepositoryAnalysis(
      testRepository,
      [
        createScoredPullRequest(
          createPullRequestScoringSource(1),
          createLlmPullRequestScore(),
        ),
        createScoredPullRequest(
          createPullRequestScoringSource(2),
          createLlmPullRequestScore({
            impact: {
              score: 60,
              rationale: "Moderate value.",
            },
            aiLeverage: {
              score: 40,
              rationale: "Limited evidence.",
            },
            quality: {
              score: 70,
              rationale: "Good but not exceptional.",
            },
          }),
        ),
      ],
      [
        {
          number: 3,
          reason: "LLM_INVALID_OUTPUT",
        },
      ],
    );

    expect(result).toEqual({
      repository: testRepository,
      summary: {
        impactScore: 69,
        aiLeverageScore: 46,
        qualityScore: 77,
        overallScore: 64,
        scoredPullRequestCount: 2,
        skippedPullRequestCount: 1,
      },
      pullRequests: result.pullRequests,
      skippedPullRequests: [
        {
          number: 3,
          reason: "LLM_INVALID_OUTPUT",
        },
      ],
    });
  });
});
