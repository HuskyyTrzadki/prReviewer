import { z } from "zod";

import { normalizedRepositorySchema } from "@/features/pr-analysis/contracts/analysis-contracts";

export const githubRepositoryDetailsSchema = normalizedRepositorySchema.extend({
  defaultBranch: z.string().trim().min(1),
});

export const normalizedPullRequestSourceSchema = z.object({
  number: z.number().int().positive(),
  title: z.string().trim().min(1),
  body: z.string(),
  authorLogin: z.string().trim().min(1).nullable(),
  htmlUrl: z.url(),
  mergedAt: z.iso.datetime({ offset: true }),
  additions: z.number().int().nonnegative(),
  deletions: z.number().int().nonnegative(),
  changedFiles: z.number().int().nonnegative(),
});

export const repositoryAnalysisSourceSchema = z.object({
  repository: githubRepositoryDetailsSchema,
  pullRequests: z.array(normalizedPullRequestSourceSchema),
  requestedPullRequestLimit: z.number().int().positive(),
});

export type GithubRepositoryDetails = z.infer<typeof githubRepositoryDetailsSchema>;
export type NormalizedPullRequestSource = z.infer<
  typeof normalizedPullRequestSourceSchema
>;
export type RepositoryAnalysisSource = z.infer<
  typeof repositoryAnalysisSourceSchema
>;
