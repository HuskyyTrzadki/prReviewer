import {
  normalizedPullRequestFileSourceSchema,
  type NormalizedPullRequestFileSource,
} from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/repository-contracts";
import {
  mapGithubRequestError,
  type GithubAnalysisResult,
} from "@/features/pr-analysis/lib/github-analysis-errors";
import {
  createGithubApiClient,
  type GithubApiClient,
} from "@/features/pr-analysis/lib/github-api-client";

export const loadPullRequestFiles = async (
  repository: NormalizedRepository,
  pullRequestNumber: number,
  client: GithubApiClient = createGithubApiClient(),
): Promise<GithubAnalysisResult<NormalizedPullRequestFileSource[]>> => {
  try {
    const files = await client.listPullRequestFiles(
      repository.owner,
      repository.repo,
      pullRequestNumber,
    );

    return {
      ok: true,
      value: files.map((file) => normalizedPullRequestFileSourceSchema.parse(file)),
    };
  } catch (error) {
    return mapGithubRequestError(error);
  }
};
