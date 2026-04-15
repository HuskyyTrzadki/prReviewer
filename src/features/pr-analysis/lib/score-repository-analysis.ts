import type { PullRequestScoringSource } from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  scoredPullRequestSchema,
  scoredRepositoryAnalysisSchema,
  type LlmPullRequestScore,
  type ScoredPullRequest,
  type ScoredRepositoryAnalysis,
  type SkippedPullRequest,
} from "@/features/pr-analysis/contracts/scoring-contracts";
import { scoringDimensionWeight } from "@/features/pr-analysis/lib/pr-analysis-config";

const clampScore = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

const calculateOverallScore = (
  impactScore: number,
  aiLeverageScore: number,
  qualityScore: number,
) =>
  clampScore(
    impactScore * scoringDimensionWeight +
      aiLeverageScore * scoringDimensionWeight +
      qualityScore * scoringDimensionWeight,
  );

const calculateAverageScore = (values: number[]) =>
  values.length === 0
    ? 0
    : clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);

export const createScoredPullRequest = (
  pullRequest: PullRequestScoringSource,
  llmScore: LlmPullRequestScore,
): ScoredPullRequest =>
  scoredPullRequestSchema.parse({
    number: pullRequest.number,
    title: pullRequest.title,
    body: pullRequest.body,
    authorLogin: pullRequest.authorLogin,
    htmlUrl: pullRequest.htmlUrl,
    mergedAt: pullRequest.mergedAt,
    additions: pullRequest.additions,
    deletions: pullRequest.deletions,
    changedFiles: pullRequest.changedFiles,
    summary: llmScore.summary,
    impactScore: clampScore(llmScore.impact.score),
    impactRationale: llmScore.impact.rationale,
    aiLeverageScore: clampScore(llmScore.aiLeverage.score),
    aiLeverageRationale: llmScore.aiLeverage.rationale,
    qualityScore: clampScore(llmScore.quality.score),
    qualityRationale: llmScore.quality.rationale,
    overallScore: calculateOverallScore(
      llmScore.impact.score,
      llmScore.aiLeverage.score,
      llmScore.quality.score,
    ),
  });

export const createScoredRepositoryAnalysis = (
  repository: NormalizedRepository,
  pullRequests: ScoredPullRequest[],
  skippedPullRequests: SkippedPullRequest[],
): ScoredRepositoryAnalysis => {
  const impactScores = pullRequests.map((pullRequest) => pullRequest.impactScore);
  const aiLeverageScores = pullRequests.map((pullRequest) => pullRequest.aiLeverageScore);
  const qualityScores = pullRequests.map((pullRequest) => pullRequest.qualityScore);

  return scoredRepositoryAnalysisSchema.parse({
    repository,
    summary: {
      impactScore: calculateAverageScore(impactScores),
      aiLeverageScore: calculateAverageScore(aiLeverageScores),
      qualityScore: calculateAverageScore(qualityScores),
      overallScore: calculateAverageScore(
        pullRequests.map((pullRequest) => pullRequest.overallScore),
      ),
      scoredPullRequestCount: pullRequests.length,
      skippedPullRequestCount: skippedPullRequests.length,
    },
    pullRequests,
    skippedPullRequests,
  });
};
