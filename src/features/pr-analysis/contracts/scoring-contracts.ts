import { z } from "zod";

import { normalizedRepositorySchema } from "@/features/pr-analysis/contracts/analysis-contracts";

const boundedScoreSchema = z.number().min(0).max(100);
const scoreRationaleSchema = z.string().trim().min(1);

export const llmScoreDimensionSchema = z.object({
  score: boundedScoreSchema,
  rationale: scoreRationaleSchema,
});

export const llmPullRequestScoreSchema = z.object({
  summary: z.string().trim().min(1),
  impact: llmScoreDimensionSchema,
  aiLeverage: llmScoreDimensionSchema,
  quality: llmScoreDimensionSchema,
});

export const skippedPullRequestReasonSchema = z.enum([
  "LLM_INVALID_OUTPUT",
  "LLM_REQUEST_FAILED",
]);

export const skippedPullRequestSchema = z.object({
  number: z.number().int().positive(),
  reason: skippedPullRequestReasonSchema,
});

export const scoredPullRequestSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().trim().min(1),
  body: z.string(),
  authorLogin: z.string().trim().min(1).nullable(),
  htmlUrl: z.url(),
  mergedAt: z.iso.datetime({ offset: true }),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
  changedFiles: z.number().int().nonnegative(),
  summary: z.string().trim().min(1),
  impactScore: boundedScoreSchema,
  impactRationale: scoreRationaleSchema,
  aiLeverageScore: boundedScoreSchema,
  aiLeverageRationale: scoreRationaleSchema,
  qualityScore: boundedScoreSchema,
  qualityRationale: scoreRationaleSchema,
  overallScore: boundedScoreSchema,
});

export const repositoryScoreSummarySchema = z.object({
  impactScore: boundedScoreSchema,
  aiLeverageScore: boundedScoreSchema,
  qualityScore: boundedScoreSchema,
  overallScore: boundedScoreSchema,
  scoredPullRequestCount: z.number().int().nonnegative(),
  skippedPullRequestCount: z.number().int().nonnegative(),
});

export const scoredRepositoryAnalysisSchema = z.object({
  repository: normalizedRepositorySchema,
  summary: repositoryScoreSummarySchema,
  pullRequests: z.array(scoredPullRequestSchema),
  skippedPullRequests: z.array(skippedPullRequestSchema),
});

export type LlmPullRequestScore = z.infer<typeof llmPullRequestScoreSchema>;
export type ScoredPullRequest = z.infer<typeof scoredPullRequestSchema>;
export type SkippedPullRequestReason = z.infer<
  typeof skippedPullRequestReasonSchema
>;
export type SkippedPullRequest = z.infer<typeof skippedPullRequestSchema>;
export type RepositoryScoreSummary = z.infer<
  typeof repositoryScoreSummarySchema
>;
export type ScoredRepositoryAnalysis = z.infer<
  typeof scoredRepositoryAnalysisSchema
>;
