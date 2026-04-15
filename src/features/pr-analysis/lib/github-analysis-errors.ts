import type { AnalysisApiErrorCode } from "@/features/pr-analysis/contracts/analysis-contracts";

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
    return createGithubAnalysisError(
      "GITHUB_UPSTREAM_ERROR",
      "GitHub could not be reached right now. Try again in a moment.",
    );
  }

  if (error.status === 404) {
    return createGithubAnalysisError(
      "REPOSITORY_NOT_FOUND_OR_PRIVATE",
      "This repository was not found or is private. Use a public GitHub repository URL.",
    );
  }

  const rateLimitRemaining = getHeaderValue(error, "x-ratelimit-remaining");

  if (error.status === 429 || (error.status === 403 && rateLimitRemaining === "0")) {
    return createGithubAnalysisError(
      "GITHUB_RATE_LIMITED",
      "GitHub rate limit was reached. Try again later.",
    );
  }

  return createGithubAnalysisError(
    "GITHUB_UPSTREAM_ERROR",
    "GitHub could not be reached right now. Try again in a moment.",
  );
};

export const createNoMergedPullRequestsError = () =>
  createGithubAnalysisError(
    "NO_MERGED_PULL_REQUESTS",
    "No merged pull requests were found for this repository.",
  );
