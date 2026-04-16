import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";
import {
  scoreFieldByKey,
  unknownAuthorFilterValue,
  type ResultsTableAuthorOption,
  type ResultsTableSizeFilter,
  type ResultsTableState,
} from "@/features/results/results-table-config";

const getPullRequestSizeValue = (pullRequest: ScoredPullRequest) =>
  pullRequest.additions + pullRequest.deletions;

const getPullRequestSizeFilter = (
  pullRequest: ScoredPullRequest,
): ResultsTableSizeFilter => {
  const sizeValue = getPullRequestSizeValue(pullRequest);

  if (sizeValue <= 25) {
    return "xs";
  }

  if (sizeValue <= 75) {
    return "sm";
  }

  if (sizeValue <= 200) {
    return "md";
  }

  return "lg";
};

export const filterAndSortPullRequests = (
  pullRequests: ScoredPullRequest[],
  state: ResultsTableState,
): ScoredPullRequest[] =>
  [...pullRequests]
    .filter((pullRequest) => {
      const searchNeedle = state.q.toLowerCase();
      const authorMatches =
        !state.author ||
        (state.author === unknownAuthorFilterValue
          ? pullRequest.authorLogin === null
          : pullRequest.authorLogin === state.author);
      const searchMatches =
        !searchNeedle ||
        `${pullRequest.title} ${pullRequest.summary}`
          .toLowerCase()
          .includes(searchNeedle);
      const sizeMatches =
        state.size === "all" || getPullRequestSizeFilter(pullRequest) === state.size;

      return (
        authorMatches &&
        searchMatches &&
        sizeMatches &&
        (!state.impactMin || pullRequest.impactScore >= state.impactMin) &&
        (!state.aiMin || pullRequest.aiLeverageScore >= state.aiMin) &&
        (!state.qualityMin || pullRequest.qualityScore >= state.qualityMin) &&
        (!state.overallMin || pullRequest.overallScore >= state.overallMin)
      );
    })
    .sort((leftPullRequest, rightPullRequest) => {
      const direction = state.dir === "asc" ? 1 : -1;
      const leftValue =
        state.sort === "mergedAt"
          ? Date.parse(leftPullRequest.mergedAt)
          : state.sort === "author"
            ? leftPullRequest.authorLogin ?? ""
            : state.sort === "size"
              ? getPullRequestSizeValue(leftPullRequest)
              : leftPullRequest[scoreFieldByKey[state.sort]];
      const rightValue =
        state.sort === "mergedAt"
          ? Date.parse(rightPullRequest.mergedAt)
          : state.sort === "author"
            ? rightPullRequest.authorLogin ?? ""
            : state.sort === "size"
              ? getPullRequestSizeValue(rightPullRequest)
              : rightPullRequest[scoreFieldByKey[state.sort]];

      if (leftValue === rightValue) {
        return rightPullRequest.number - leftPullRequest.number;
      }

      return leftValue > rightValue ? direction : -direction;
    });

export const getResultsTableAuthorOptions = (
  pullRequests: ScoredPullRequest[],
): ResultsTableAuthorOption[] => {
  const authorValues = new Set<string>();

  pullRequests.forEach((pullRequest) => {
    authorValues.add(pullRequest.authorLogin ?? unknownAuthorFilterValue);
  });

  return [...authorValues]
    .sort((leftValue, rightValue) => {
      if (leftValue === unknownAuthorFilterValue) {
        return 1;
      }

      if (rightValue === unknownAuthorFilterValue) {
        return -1;
      }

      return leftValue.localeCompare(rightValue);
    })
    .map((value) => ({
      value,
      label: value === unknownAuthorFilterValue ? "Unknown author" : value,
    }));
};
