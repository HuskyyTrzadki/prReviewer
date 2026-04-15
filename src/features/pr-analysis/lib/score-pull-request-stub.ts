import type { PullRequestScoringSource } from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/repository-contracts";
import type { LlmPullRequestScore } from "@/features/pr-analysis/contracts/scoring-contracts";

const clampScore = (value: number) => Math.min(100, Math.max(0, Math.round(value)));

const calculateImpactScore = (pullRequest: PullRequestScoringSource) =>
  clampScore(
    35 +
      pullRequest.changedFiles * 4 +
      Math.min(20, pullRequest.additions / 12) +
      Math.min(10, pullRequest.deletions / 20),
  );

const calculateAiLeverageScore = (pullRequest: PullRequestScoringSource) => {
  const combinedText = `${pullRequest.title}\n${pullRequest.body}`.toLowerCase();
  const aiSignal =
    combinedText.includes("ai") ||
    combinedText.includes("llm") ||
    combinedText.includes("copilot") ||
    combinedText.includes("generated");

  return clampScore(30 + pullRequest.files.length * 3 + (aiSignal ? 18 : 0));
};

const calculateQualityScore = (pullRequest: PullRequestScoringSource) =>
  clampScore(
    55 +
      Math.min(20, pullRequest.files.length * 2) +
      Math.min(15, pullRequest.changedFiles * 2) -
      Math.min(18, pullRequest.deletions / 25),
  );

export const scorePullRequestStub = async (
  pullRequest: PullRequestScoringSource,
  repository: NormalizedRepository,
): Promise<LlmPullRequestScore> => ({
  summary: `Temporary local score for ${repository.fullName} PR #${pullRequest.number}.`,
  impact: {
    score: calculateImpactScore(pullRequest),
    rationale: "Temporary local estimate based on change size and file spread.",
  },
  aiLeverage: {
    score: calculateAiLeverageScore(pullRequest),
    rationale: "Temporary local estimate based on lightweight textual and diff heuristics.",
  },
  quality: {
    score: calculateQualityScore(pullRequest),
    rationale: "Temporary local estimate based on scope and change distribution.",
  },
});
