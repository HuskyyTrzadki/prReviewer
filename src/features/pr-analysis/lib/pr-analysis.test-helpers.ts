import type { NormalizedRepository } from "@/features/pr-analysis/contracts/analysis-contracts";
import type {
  GithubApiClient,
  GithubPullRequestFileRecord,
  GithubPullRequestRecord,
  GithubRepositoryRecord,
} from "@/features/pr-analysis/lib/github-api-client";

type GithubRequestHeaders = Record<string, string | number | undefined>;

export type TestGithubRequestError = Error & {
  response?: {
    headers?: GithubRequestHeaders;
  };
  status?: number;
};

export const testRepository: NormalizedRepository = {
  owner: "vercel",
  repo: "next.js",
  fullName: "vercel/next.js",
  canonicalUrl: "https://github.com/vercel/next.js",
};

const createUnexpectedClientMethodError = (methodName: string) =>
  new Error(`Unexpected ${methodName} call in test.`);

export const createGithubRepositoryRecord = (
  overrides: Partial<GithubRepositoryRecord> = {},
): GithubRepositoryRecord => ({
  defaultBranch: "main",
  fullName: "vercel/next.js",
  isPrivate: false,
  ownerLogin: "vercel",
  repoName: "next.js",
  ...overrides,
});

export const createGithubPullRequestRecord = (
  number: number,
  overrides: Partial<GithubPullRequestRecord> = {},
): GithubPullRequestRecord => ({
  number,
  title: `PR ${number}`,
  body: `Body ${number}`,
  authorLogin: `author-${number}`,
  htmlUrl: `https://github.com/vercel/next.js/pull/${number}`,
  mergedAt: "2026-04-14T19:00:00.000Z",
  additions: number * 2,
  deletions: number,
  changedFiles: 3,
  ...overrides,
});

export const createGithubPullRequestFileRecord = (
  filename: string,
  overrides: Partial<GithubPullRequestFileRecord> = {},
): GithubPullRequestFileRecord => ({
  filename,
  status: "modified",
  additions: 5,
  deletions: 2,
  patch: "@@ -1 +1 @@\n-old\n+new",
  ...overrides,
});

export const createGithubApiClientMock = (
  overrides: Partial<GithubApiClient>,
): GithubApiClient => ({
  getRepository: async () => {
    throw createUnexpectedClientMethodError("getRepository");
  },
  getPullRequest: async () => {
    throw createUnexpectedClientMethodError("getPullRequest");
  },
  listClosedPullRequests: async () => {
    throw createUnexpectedClientMethodError("listClosedPullRequests");
  },
  listPullRequestFiles: async () => {
    throw createUnexpectedClientMethodError("listPullRequestFiles");
  },
  ...overrides,
});

export const createGithubRequestError = (
  message: string,
  overrides: Omit<TestGithubRequestError, "message" | "name"> = {},
): TestGithubRequestError =>
  Object.assign(new Error(message), overrides);
