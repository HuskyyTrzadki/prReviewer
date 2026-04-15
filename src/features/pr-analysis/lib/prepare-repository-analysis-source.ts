import {
  repositoryAnalysisSourceSchema,
  type RepositoryAnalysisSource,
} from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/analysis-contracts";
import type { GithubAnalysisResult } from "@/features/pr-analysis/lib/github-analysis-errors";
import {
  createGithubApiClient,
  type GithubApiClient,
} from "@/features/pr-analysis/lib/github-api-client";
import { loadGithubRepository } from "@/features/pr-analysis/lib/load-github-repository";
import { loadMergedPullRequests } from "@/features/pr-analysis/lib/load-merged-pull-requests";
import { mergedPullRequestLimit } from "@/features/pr-analysis/lib/pr-analysis-config";

export const prepareRepositoryAnalysisSource = async (
  repository: NormalizedRepository,
  client: GithubApiClient = createGithubApiClient(),
): Promise<GithubAnalysisResult<RepositoryAnalysisSource>> => {
  const repositoryResult = await loadGithubRepository(repository, client);

  if (!repositoryResult.ok) {
    return repositoryResult;
  }

  const pullRequestsResult = await loadMergedPullRequests(
    repositoryResult.value,
    client,
    mergedPullRequestLimit,
  );

  if (!pullRequestsResult.ok) {
    return pullRequestsResult;
  }

  return {
    ok: true,
    value: repositoryAnalysisSourceSchema.parse({
      repository: repositoryResult.value,
      pullRequests: pullRequestsResult.value,
      requestedPullRequestLimit: mergedPullRequestLimit,
    }),
  };
};
