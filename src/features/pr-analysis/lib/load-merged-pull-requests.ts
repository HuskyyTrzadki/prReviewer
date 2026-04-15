import {
  normalizedPullRequestSourceSchema,
  type NormalizedPullRequestSource,
} from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  createNoMergedPullRequestsError,
  type GithubAnalysisResult,
  mapGithubRequestError,
} from "@/features/pr-analysis/lib/github-analysis-errors";
import {
  createGithubApiClient,
  type GithubApiClient,
} from "@/features/pr-analysis/lib/github-api-client";
import {
  githubPullRequestPageSize,
  mergedPullRequestLimit,
} from "@/features/pr-analysis/lib/pr-analysis-config";

const collectMergedPullRequestNumbers = async (
  repository: NormalizedRepository,
  client: GithubApiClient,
  limit: number,
) => {
  const pullRequestNumbers: number[] = [];
  let page = 1;

  while (pullRequestNumbers.length < limit) {
    const pullRequests = await client.listClosedPullRequests(
      repository.owner,
      repository.repo,
      page,
      githubPullRequestPageSize,
    );

    if (pullRequests.length === 0) {
      break;
    }

    pullRequestNumbers.push(
      ...pullRequests
        .filter((pullRequest) => pullRequest.mergedAt)
        .map((pullRequest) => pullRequest.number)
        .slice(0, limit - pullRequestNumbers.length),
    );

    page += 1;
  }

  return pullRequestNumbers;
};

export const loadMergedPullRequests = async (
  repository: NormalizedRepository,
  client: GithubApiClient = createGithubApiClient(),
  limit = mergedPullRequestLimit,
): Promise<GithubAnalysisResult<NormalizedPullRequestSource[]>> => {
  try {
    const pullRequestNumbers = await collectMergedPullRequestNumbers(
      repository,
      client,
      limit,
    );

    if (pullRequestNumbers.length === 0) {
      return createNoMergedPullRequestsError();
    }

    const pullRequests = await Promise.all(
      pullRequestNumbers.map((pullNumber) =>
        client.getPullRequest(repository.owner, repository.repo, pullNumber),
      ),
    );

    return {
      ok: true,
      value: pullRequests.map((pullRequest) =>
        normalizedPullRequestSourceSchema.parse(pullRequest),
      ),
    };
  } catch (error) {
    return mapGithubRequestError(error);
  }
};
