import { z } from "zod";

import {
  normalizedRepositorySchema,
} from "@/features/pr-analysis/contracts/repository-contracts";
import { repositoryUrlErrorCodes } from "@/shared/lib/repository-url";
import {
  repositoryScoreSummarySchema,
  scoredPullRequestSchema,
  skippedPullRequestSchema,
} from "@/features/pr-analysis/contracts/scoring-contracts";

export const repoIdSchema = z.string().trim().min(1);
export const analysisApiErrorCodes = [
  "INVALID_REQUEST_BODY",
  "CONFIGURATION_ERROR",
  "REPOSITORY_NOT_FOUND_OR_PRIVATE",
  "NO_MERGED_PULL_REQUESTS",
  "GITHUB_RATE_LIMITED",
  "GITHUB_UPSTREAM_ERROR",
  "ANALYSIS_FAILED",
  ...repositoryUrlErrorCodes,
] as const;

export const analyzeRepositoryRequestSchema = z.object({
  repositoryUrl: z.string().trim().min(1),
});

export const analysisApiErrorCodeSchema = z.enum(analysisApiErrorCodes);

export const analysisApiErrorSchema = z.object({
  status: z.literal("error"),
  code: analysisApiErrorCodeSchema,
  message: z.string().trim().min(1),
});

export const analyzeRepositorySuccessSchema = z.object({
  status: z.literal("success"),
  repository: normalizedRepositorySchema,
  repoId: repoIdSchema,
  redirectUrl: z.string().regex(/^\/results\/[^/]+$/),
  analysis: z.object({
    summary: repositoryScoreSummarySchema,
    pullRequests: z.array(scoredPullRequestSchema),
    skippedPullRequests: z.array(skippedPullRequestSchema),
  }),
});

export const analyzeRepositoryResponseSchema = z.discriminatedUnion("status", [
  analyzeRepositorySuccessSchema,
  analysisApiErrorSchema,
]);

const analysisResultStatusSchema = z.enum([
  "pending",
  "completed",
  "failed",
]);

export const analysisResultSchema = z.object({
  repoId: repoIdSchema,
  repository: normalizedRepositorySchema,
  status: analysisResultStatusSchema,
});

export type RepoId = z.infer<typeof repoIdSchema>;
export type AnalysisApiErrorCode = z.infer<typeof analysisApiErrorCodeSchema>;
export type AnalyzeRepositorySuccess = z.infer<
  typeof analyzeRepositorySuccessSchema
>;
export type AnalyzeRepositoryResponse = z.infer<
  typeof analyzeRepositoryResponseSchema
>;
