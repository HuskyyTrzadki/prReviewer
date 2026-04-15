import type { AnalysisApiErrorCode } from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  githubRateLimitedMessage,
  githubUpstreamErrorMessage,
  noMergedPullRequestsMessage,
  repositoryNotFoundOrPrivateMessage,
} from "@/features/pr-analysis/lib/analysis-api-errors";

type GithubRequestFailure = Error & {
  response?: {
    headers?: Record<string, string | number | undefined>;
  };
  status?: number;
};

export type GithubAnalysisErrorCode = Extract<
  AnalysisApiErrorCode,
  | "REPOSITORY_NOT_FOUND_OR_PRIVATE"
  | "NO_MERGED_PULL_REQUESTS"
  | "GITHUB_RATE_LIMITED"
  | "GITHUB_UPSTREAM_ERROR"
>;

export type GithubAnalysisError = {
  code: GithubAnalysisErrorCode;
  message: string;
};

export type GithubAnalysisResult<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      error: GithubAnalysisError;
    };

const createGithubAnalysisError = (
  code: GithubAnalysisErrorCode,
  message: string,
): GithubAnalysisResult<never> => ({
  ok: false,
  error: { code, message },
});

const isGithubRequestFailure = (error: unknown): error is GithubRequestFailure =>
  error instanceof Error;

const isGithubRateLimitMessage = (message: string) =>
  /quota exhausted|rate limit exceeded|secondary rate limit/i.test(message);

const getHeaderValue = (
  error: GithubRequestFailure,
  headerName: string,
) => {
  const matchingEntry = Object.entries(error.response?.headers ?? {}).find(
    ([key]) => key.toLowerCase() === headerName,
  );

  return matchingEntry?.[1];
};

export const mapGithubRequestError = (error: unknown) => {
  if (!isGithubRequestFailure(error)) {
    return createGithubUpstreamError();
  }

  if (error.status === 404) {
    return createRepositoryNotFoundOrPrivateError();
  }

  const rateLimitRemaining = getHeaderValue(error, "x-ratelimit-remaining");

  if (
    error.status === 429 ||
    (error.status === 403 && rateLimitRemaining === "0") ||
    isGithubRateLimitMessage(error.message)
  ) {
    return createGithubAnalysisError("GITHUB_RATE_LIMITED", githubRateLimitedMessage);
  }

  return createGithubUpstreamError();
};

export const createGithubUpstreamError = () =>
  createGithubAnalysisError("GITHUB_UPSTREAM_ERROR", githubUpstreamErrorMessage);

export const createRepositoryNotFoundOrPrivateError = () =>
  createGithubAnalysisError(
    "REPOSITORY_NOT_FOUND_OR_PRIVATE",
    repositoryNotFoundOrPrivateMessage,
  );

export const createNoMergedPullRequestsError = () =>
  createGithubAnalysisError("NO_MERGED_PULL_REQUESTS", noMergedPullRequestsMessage);
