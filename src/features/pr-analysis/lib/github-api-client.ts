import { Octokit } from "octokit";

export type GithubRepositoryRecord = {
  defaultBranch: string;
  fullName: string;
  isPrivate: boolean;
  ownerLogin: string;
  repoName: string;
};

export type GithubClosedPullRequestListItem = {
  mergedAt: string | null;
  number: number;
};

export type GithubPullRequestRecord = {
  additions: number;
  authorLogin: string | null;
  body: string;
  changedFiles: number;
  deletions: number;
  htmlUrl: string;
  mergedAt: string;
  number: number;
  title: string;
};

export type GithubApiClient = {
  getRepository: (
    owner: string,
    repo: string,
  ) => Promise<GithubRepositoryRecord>;
  getPullRequest: (
    owner: string,
    repo: string,
    pullNumber: number,
  ) => Promise<GithubPullRequestRecord>;
  listClosedPullRequests: (
    owner: string,
    repo: string,
    page: number,
    perPage: number,
  ) => Promise<GithubClosedPullRequestListItem[]>;
};

export const getGithubAuthToken = (rawToken = process.env.GITHUB_TOKEN) => {
  const token = rawToken?.trim();

  return token ? token : undefined;
};

export const createGithubApiClient = (): GithubApiClient => {
  const octokit = new Octokit({
    auth: getGithubAuthToken(),
  });

  return {
    getRepository: async (owner, repo) => {
      const response = await octokit.rest.repos.get({
        owner,
        repo,
      });

      return {
        defaultBranch: response.data.default_branch,
        fullName: response.data.full_name,
        isPrivate: response.data.private,
        ownerLogin: response.data.owner.login,
        repoName: response.data.name,
      };
    },
    listClosedPullRequests: async (owner, repo, page, perPage) => {
      const response = await octokit.rest.pulls.list({
        owner,
        repo,
        state: "closed",
        page,
        per_page: perPage,
      });

      return response.data.map((pullRequest) => ({
        mergedAt: pullRequest.merged_at,
        number: pullRequest.number,
      }));
    },
    getPullRequest: async (owner, repo, pullNumber) => {
      const response = await octokit.rest.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
      });

      return {
        number: response.data.number,
        title: response.data.title,
        body: response.data.body ?? "",
        authorLogin: response.data.user?.login ?? null,
        htmlUrl: response.data.html_url,
        mergedAt: response.data.merged_at ?? "",
        additions: response.data.additions,
        deletions: response.data.deletions,
        changedFiles: response.data.changed_files,
      };
    },
  };
};
