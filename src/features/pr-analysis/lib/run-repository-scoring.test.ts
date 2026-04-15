import { describe, expect, it } from "vitest";

import { analysisFailedMessage } from "@/features/pr-analysis/lib/analysis-api-errors";
import { runRepositoryScoring } from "@/features/pr-analysis/lib/run-repository-scoring";
import {
  createLlmPullRequestScore,
  createPullRequestScoringSource,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

const repositoryScoringSource = {
  repository: {
    ...testRepository,
    defaultBranch: "canary",
  },
  pullRequests: [
    createPullRequestScoringSource(1),
    createPullRequestScoringSource(2),
    createPullRequestScoringSource(3),
  ],
  requestedPullRequestLimit: 8,
} as const;

describe("runRepositoryScoring", () => {
  it("returns scored and skipped pull requests from one repository scoring run", async () => {
    const result = await runRepositoryScoring(
      repositoryScoringSource,
      async (pullRequest) => {
        if (pullRequest.number === 2) {
          return {
            summary: "Missing dimensions on purpose.",
          };
        }

        if (pullRequest.number === 3) {
          throw new Error("provider timeout");
        }

        return createLlmPullRequestScore();
      },
    );

    expect(result).toEqual({
      ok: true,
      value: {
        repository: testRepository,
        summary: {
          impactScore: 78,
          aiLeverageScore: 52,
          qualityScore: 84,
          overallScore: 71,
          scoredPullRequestCount: 1,
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
        ],
        skippedPullRequests: [
          {
            number: 2,
            reason: "LLM_INVALID_OUTPUT",
          },
          {
            number: 3,
            reason: "LLM_REQUEST_FAILED",
          },
        ],
      },
    });
  });

  it("returns a typed failure when every pull request is skipped", async () => {
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
