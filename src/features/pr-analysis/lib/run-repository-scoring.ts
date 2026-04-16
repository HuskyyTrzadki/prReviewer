import { type RepositoryScoringSource } from "@/features/pr-analysis/contracts/analysis-source";
import type { AnalysisApiErrorCode } from "@/features/pr-analysis/contracts/analysis-contracts";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/repository-contracts";
import {
  llmPullRequestBatchItemSchema,
  type LlmPullRequestScore,
  type ScoredRepositoryAnalysis,
  type SkippedPullRequest,
} from "@/features/pr-analysis/contracts/scoring-contracts";
import { analysisFailedMessage } from "@/features/pr-analysis/lib/analysis-api-errors";
import { geminiPullRequestBatchSize } from "@/features/pr-analysis/lib/pr-analysis-config";
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

type PullRequestScoreRunner = (
  pullRequests: RepositoryScoringSource["pullRequests"],
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

const chunkPullRequests = (
  pullRequests: RepositoryScoringSource["pullRequests"],
) => {
  const batches = [];

  for (let index = 0; index < pullRequests.length; index += geminiPullRequestBatchSize) {
    batches.push(pullRequests.slice(index, index + geminiPullRequestBatchSize));
  }

  return batches;
};

const extractPullRequestScores = (rawScore: unknown, requestedNumbers: Set<number>) => {
  if (
    !rawScore ||
    typeof rawScore !== "object" ||
    !("pullRequests" in rawScore) ||
    !Array.isArray(rawScore.pullRequests)
  ) {
    return new Map<number, LlmPullRequestScore>();
  }

  const parsedScores = new Map<number, LlmPullRequestScore>();

  for (const item of rawScore.pullRequests) {
    const parsedItem = llmPullRequestBatchItemSchema.safeParse(item);

    if (!parsedItem.success) {
      continue;
    }

    if (
      !requestedNumbers.has(parsedItem.data.number) ||
      parsedScores.has(parsedItem.data.number)
    ) {
      continue;
    }

    parsedScores.set(parsedItem.data.number, {
      summary: parsedItem.data.summary,
      impact: parsedItem.data.impact,
      aiLeverage: parsedItem.data.aiLeverage,
      quality: parsedItem.data.quality,
    });
  }

  return parsedScores;
};

export const runRepositoryScoring = async (
  source: RepositoryScoringSource,
  scorePullRequests: PullRequestScoreRunner,
): Promise<RepositoryScoringResult> => {
  const batchResults = await Promise.all(
    chunkPullRequests(source.pullRequests).map(async (pullRequestBatch) => {
      const scoredPullRequests = [];
      const skippedPullRequests: SkippedPullRequest[] = [];

      try {
        const rawScore = await scorePullRequests(pullRequestBatch, source.repository);
        const requestedNumbers = new Set(
          pullRequestBatch.map((pullRequest) => pullRequest.number),
        );
        const parsedScores = extractPullRequestScores(rawScore, requestedNumbers);

        if (parsedScores.size === 0) {
          console.error("Pull request scoring returned invalid structured output", {
            repository: source.repository.fullName,
            pullRequestNumbers: pullRequestBatch.map((pullRequest) => pullRequest.number),
            rawScore,
          });
        }

        for (const pullRequest of pullRequestBatch) {
          const parsedScore = parsedScores.get(pullRequest.number);

          if (!parsedScore) {
            skippedPullRequests.push(
              createSkippedPullRequest(pullRequest.number, "LLM_INVALID_OUTPUT"),
            );
            continue;
          }

          scoredPullRequests.push(createScoredPullRequest(pullRequest, parsedScore));
        }
      } catch (error) {
        console.error("Pull request scoring request failed", {
          repository: source.repository.fullName,
          pullRequestNumbers: pullRequestBatch.map((pullRequest) => pullRequest.number),
          message: error instanceof Error ? error.message : String(error),
        });

        for (const pullRequest of pullRequestBatch) {
          skippedPullRequests.push(
            createSkippedPullRequest(pullRequest.number, "LLM_REQUEST_FAILED"),
          );
        }
      }

      return {
        scoredPullRequests,
        skippedPullRequests,
      };
    }),
  );

  const scoredPullRequests = batchResults.flatMap((batchResult) => batchResult.scoredPullRequests);
  const skippedPullRequests = batchResults.flatMap(
    (batchResult) => batchResult.skippedPullRequests,
  );

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
