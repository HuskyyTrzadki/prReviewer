import { type RepositoryScoringSource } from "@/features/pr-analysis/contracts/analysis-source";
import type { AnalysisApiErrorCode, NormalizedRepository } from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  llmPullRequestScoreSchema,
  type LlmPullRequestScore,
  type ScoredRepositoryAnalysis,
  type SkippedPullRequest,
} from "@/features/pr-analysis/contracts/scoring-contracts";
import { analysisFailedMessage } from "@/features/pr-analysis/lib/analysis-api-errors";
import {
  createScoredPullRequest,
  createScoredRepositoryAnalysis,
} from "@/features/pr-analysis/lib/score-repository-analysis";

type RepositoryScoringFailure = {
  code: Extract<AnalysisApiErrorCode, "ANALYSIS_FAILED">;
  message: string;
};

type RepositoryScoringResult =
  | {
      ok: true;
      value: ScoredRepositoryAnalysis;
    }
  | {
      ok: false;
      error: RepositoryScoringFailure;
    };

export type PullRequestScoreRunner = (
  pullRequest: RepositoryScoringSource["pullRequests"][number],
  repository: NormalizedRepository,
) => Promise<unknown>;

const createSkippedPullRequest = (
  number: number,
  reason: SkippedPullRequest["reason"],
): SkippedPullRequest => ({
  number,
  reason,
});

const createAnalysisFailedResult = (): RepositoryScoringResult => ({
  ok: false,
  error: {
    code: "ANALYSIS_FAILED",
    message: analysisFailedMessage,
  },
});

const parsePullRequestScore = (
  rawScore: unknown,
): { ok: true; value: LlmPullRequestScore } | { ok: false } => {
  const parsedScore = llmPullRequestScoreSchema.safeParse(rawScore);

  if (!parsedScore.success) {
    return { ok: false };
  }

  return {
    ok: true,
    value: parsedScore.data,
  };
};

export const runRepositoryScoring = async (
  source: RepositoryScoringSource,
  scorePullRequest: PullRequestScoreRunner,
): Promise<RepositoryScoringResult> => {
  const scoredPullRequests = [];
  const skippedPullRequests: SkippedPullRequest[] = [];

  for (const pullRequest of source.pullRequests) {
    try {
      const rawScore = await scorePullRequest(pullRequest, source.repository);
      const parsedScore = parsePullRequestScore(rawScore);

      if (!parsedScore.ok) {
        console.error("Pull request scoring returned invalid output", {
          repository: source.repository.fullName,
          pullRequestNumber: pullRequest.number,
          rawScore,
        });
        skippedPullRequests.push(
          createSkippedPullRequest(pullRequest.number, "LLM_INVALID_OUTPUT"),
        );
        continue;
      }

      scoredPullRequests.push(
        createScoredPullRequest(pullRequest, parsedScore.value),
      );
    } catch {
      console.error("Pull request scoring request failed", {
        repository: source.repository.fullName,
        pullRequestNumber: pullRequest.number,
      });
      skippedPullRequests.push(
        createSkippedPullRequest(pullRequest.number, "LLM_REQUEST_FAILED"),
      );
    }
  }

  if (scoredPullRequests.length === 0) {
    return createAnalysisFailedResult();
  }

  return {
    ok: true,
    value: createScoredRepositoryAnalysis(
      source.repository,
      scoredPullRequests,
      skippedPullRequests,
    ),
  };
};
