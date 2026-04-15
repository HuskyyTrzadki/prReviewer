import { describe, expect, it, vi } from "vitest";

import type { RepositoryScoringSource } from "@/features/pr-analysis/contracts/analysis-source";
import { analysisFailedMessage } from "@/features/pr-analysis/lib/analysis-api-errors";
import { runRepositoryScoring } from "@/features/pr-analysis/lib/run-repository-scoring";
import {
  createLlmPullRequestScore,
  createPullRequestScoringSource,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

const repositoryScoringSource: RepositoryScoringSource = {
  repository: {
    ...testRepository,
    defaultBranch: "canary",
  },
  pullRequests: [
    createPullRequestScoringSource(1),
    createPullRequestScoringSource(2),
    createPullRequestScoringSource(3),
    createPullRequestScoringSource(4),
  ],
  requestedPullRequestLimit: 8,
};

describe("runRepositoryScoring", () => {
  it("returns scored and skipped pull requests from batched repository scoring", async () => {
    const scorePullRequests = vi.fn(async (pullRequestBatch) => {
      if (pullRequestBatch.some((pullRequest) => pullRequest.number === 4)) {
        throw new Error("provider timeout");
      }

      return {
        pullRequests: [
          {
            number: 1,
            ...createLlmPullRequestScore(),
          },
          {
            number: 3,
            ...createLlmPullRequestScore({
              summary: "Useful change with valid but separate scoring.",
              impact: {
                score: 60,
                rationale: "Moderate product impact.",
              },
              aiLeverage: {
                score: 70,
                rationale: "Clear AI-assisted drafting patterns.",
              },
              quality: {
                score: 80,
                rationale: "Well-structured implementation details.",
              },
            }),
          },
        ],
      };
    });

    const result = await runRepositoryScoring(
      repositoryScoringSource,
      scorePullRequests,
    );

    expect(scorePullRequests).toHaveBeenCalledTimes(2);
    expect(scorePullRequests.mock.calls[0]?.[0].map(({ number }) => number)).toEqual([
      1, 2, 3,
    ]);
    expect(scorePullRequests.mock.calls[1]?.[0].map(({ number }) => number)).toEqual([
      4,
    ]);
    expect(result).toEqual({
      ok: true,
      value: {
        repository: testRepository,
        summary: {
          impactScore: 69,
          aiLeverageScore: 61,
          qualityScore: 82,
          overallScore: 71,
          scoredPullRequestCount: 2,
          skippedPullRequestCount: 2,
        },
        pullRequests: [
          {
            number: 1,
            title: "PR 1",
            body: "Body 1",
            authorLogin: "author-1",
            htmlUrl: "https://github.com/vercel/next.js/pull/1",
            mergedAt: "2026-04-14T19:00:00.000Z",
            additions: 2,
            deletions: 1,
            changedFiles: 3,
            summary: "Solid improvement with clear engineering value.",
            impactScore: 78,
            impactRationale: "Improves an important contributor workflow.",
            aiLeverageScore: 52,
            aiLeverageRationale:
              "Some repetitive drafting patterns suggest assisted generation.",
            qualityScore: 84,
            qualityRationale:
              "The change is cohesive and implementation details are clean.",
            overallScore: 71,
          },
          {
            number: 3,
            title: "PR 3",
            body: "Body 3",
            authorLogin: "author-3",
            htmlUrl: "https://github.com/vercel/next.js/pull/3",
            mergedAt: "2026-04-14T19:00:00.000Z",
            additions: 6,
            deletions: 3,
            changedFiles: 3,
            summary: "Useful change with valid but separate scoring.",
            impactScore: 60,
            impactRationale: "Moderate product impact.",
            aiLeverageScore: 70,
            aiLeverageRationale: "Clear AI-assisted drafting patterns.",
            qualityScore: 80,
            qualityRationale: "Well-structured implementation details.",
            overallScore: 70,
          },
        ],
        skippedPullRequests: [
          {
            number: 2,
            reason: "LLM_INVALID_OUTPUT",
          },
          {
            number: 4,
            reason: "LLM_REQUEST_FAILED",
          },
        ],
      },
    });
  });

  it("returns a typed failure when every pull request batch is skipped", async () => {
    const result = await runRepositoryScoring(
      repositoryScoringSource,
      async () => {
        throw new Error("provider timeout");
      },
    );

    expect(result).toEqual({
      ok: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: analysisFailedMessage,
      },
    });
  });
});
