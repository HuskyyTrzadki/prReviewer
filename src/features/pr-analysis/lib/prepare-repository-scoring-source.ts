import {
  repositoryScoringSourceSchema,
  type RepositoryAnalysisSource,
  type RepositoryScoringSource,
} from "@/features/pr-analysis/contracts/analysis-source";
import type { GithubAnalysisResult } from "@/features/pr-analysis/lib/github-analysis-errors";
import {
  createGithubApiClient,
  type GithubApiClient,
} from "@/features/pr-analysis/lib/github-api-client";
import { loadPullRequestFiles } from "@/features/pr-analysis/lib/load-pull-request-files";
import { scoredPullRequestLimit } from "@/features/pr-analysis/lib/pr-analysis-config";

const createScoringPullRequests = async (
  source: RepositoryAnalysisSource,
  client: GithubApiClient,
) => {
  const scoringCandidates = source.pullRequests.slice(0, scoredPullRequestLimit);
  const scoringPullRequests = [];

  for (const pullRequest of scoringCandidates) {
    const filesResult = await loadPullRequestFiles(
      source.repository,
      pullRequest.number,
      client,
    );

    if (!filesResult.ok) {
      return filesResult;
    }

    scoringPullRequests.push({
      ...pullRequest,
      files: filesResult.value,
    });
  }

  return {
    ok: true,
    value: scoringPullRequests,
  } as const;
};

export const prepareRepositoryScoringSource = async (
  source: RepositoryAnalysisSource,
  client: GithubApiClient = createGithubApiClient(),
): Promise<GithubAnalysisResult<RepositoryScoringSource>> => {
  const pullRequestsResult = await createScoringPullRequests(source, client);

  if (!pullRequestsResult.ok) {
    return pullRequestsResult;
  }

  return {
    ok: true,
    value: repositoryScoringSourceSchema.parse({
      repository: source.repository,
      pullRequests: pullRequestsResult.value,
      requestedPullRequestLimit: scoredPullRequestLimit,
    }),
  };
};
