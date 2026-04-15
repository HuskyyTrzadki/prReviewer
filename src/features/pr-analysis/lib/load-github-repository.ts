import {
  githubRepositoryDetailsSchema,
  type GithubRepositoryDetails,
} from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  type GithubAnalysisResult,
  mapGithubRequestError,
} from "@/features/pr-analysis/lib/github-analysis-errors";
import {
  createGithubApiClient,
  type GithubApiClient,
} from "@/features/pr-analysis/lib/github-api-client";

const createRepositoryVisibilityError = (): GithubAnalysisResult<never> => ({
  ok: false,
  error: {
    code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
    message:
      "This repository was not found or is private. Use a public GitHub repository URL.",
  },
});

export const loadGithubRepository = async (
  repository: NormalizedRepository,
  client: GithubApiClient = createGithubApiClient(),
): Promise<GithubAnalysisResult<GithubRepositoryDetails>> => {
  try {
    const githubRepository = await client.getRepository(
      repository.owner,
      repository.repo,
    );

    if (githubRepository.isPrivate) {
      return createRepositoryVisibilityError();
    }

    return {
      ok: true,
      value: githubRepositoryDetailsSchema.parse({
        owner: githubRepository.ownerLogin,
        repo: githubRepository.repoName,
        fullName: githubRepository.fullName,
        canonicalUrl: repository.canonicalUrl,
        defaultBranch: githubRepository.defaultBranch,
      }),
    };
  } catch (error) {
    return mapGithubRequestError(error);
  }
};
