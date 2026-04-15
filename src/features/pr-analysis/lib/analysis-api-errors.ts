import type { AnalysisApiErrorCode } from "@/features/pr-analysis/contracts/analysis-contracts";

export const invalidAnalyzeRequestBodyMessage =
  "Request body must be valid JSON with a repositoryUrl field.";
export const repositoryNotFoundOrPrivateMessage =
  "This repository was not found or is private. Use a public GitHub repository URL.";
export const noMergedPullRequestsMessage =
  "No merged pull requests were found for this repository.";
export const githubRateLimitedMessage =
  "GitHub rate limit was reached. Try again later.";
export const githubUpstreamErrorMessage =
  "GitHub could not be reached right now. Try again in a moment.";

const analysisApiErrorStatusByCode: Record<AnalysisApiErrorCode, number> = {
  INVALID_REQUEST_BODY: 400,
  INVALID_REPOSITORY_URL: 400,
  UNSUPPORTED_REPOSITORY_HOST: 400,
  UNSUPPORTED_REPOSITORY_RESOURCE: 400,
  REPOSITORY_NOT_FOUND_OR_PRIVATE: 404,
  NO_MERGED_PULL_REQUESTS: 422,
  GITHUB_RATE_LIMITED: 429,
  GITHUB_UPSTREAM_ERROR: 502,
};

export const getAnalysisApiErrorStatus = (code: AnalysisApiErrorCode) =>
  analysisApiErrorStatusByCode[code];
