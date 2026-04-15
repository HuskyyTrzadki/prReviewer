import { z } from "zod";

import { repositoryUrlErrorCodes } from "@/features/pr-analysis/lib/repository-url";

export const repoIdSchema = z.string().trim().min(1);
export const analysisApiErrorCodes = [
  "INVALID_REQUEST_BODY",
  "REPOSITORY_NOT_FOUND_OR_PRIVATE",
  "NO_MERGED_PULL_REQUESTS",
  "GITHUB_RATE_LIMITED",
  "GITHUB_UPSTREAM_ERROR",
  "ANALYSIS_FAILED",
  ...repositoryUrlErrorCodes,
] as const;

export const normalizedRepositorySchema = z.object({
  owner: z.string().trim().min(1),
  repo: z.string().trim().min(1),
  fullName: z.string().trim().min(1),
  canonicalUrl: z.url(),
});

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
});

export const analyzeRepositoryResponseSchema = z.discriminatedUnion("status", [
  analyzeRepositorySuccessSchema,
  analysisApiErrorSchema,
]);

export const analysisResultStatusSchema = z.enum([
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
export type NormalizedRepository = z.infer<typeof normalizedRepositorySchema>;
export type AnalyzeRepositoryRequest = z.infer<
  typeof analyzeRepositoryRequestSchema
>;
export type AnalysisApiErrorCode = z.infer<typeof analysisApiErrorCodeSchema>;
export type AnalysisApiError = z.infer<typeof analysisApiErrorSchema>;
export type AnalyzeRepositorySuccess = z.infer<
  typeof analyzeRepositorySuccessSchema
>;
export type AnalyzeRepositoryResponse = z.infer<
  typeof analyzeRepositoryResponseSchema
>;
export type AnalysisResultStatus = z.infer<typeof analysisResultStatusSchema>;
export type AnalysisResult = z.infer<typeof analysisResultSchema>;
