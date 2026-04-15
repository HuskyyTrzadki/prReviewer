import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";

const sizeFilters = ["all", "xs", "sm", "md", "lg"] as const;
const sortKeys = [
  "mergedAt",
  "author",
  "size",
  "impact",
  "aiLeverage",
  "quality",
  "overall",
] as const;
const sortDirections = ["asc", "desc"] as const;
const minimumScoreValues = [50, 70, 85] as const;

type SearchParamsLike = Pick<URLSearchParams, "get">;
type ResultsTableSizeFilter = (typeof sizeFilters)[number];
type ResultsTableSortKey = (typeof sortKeys)[number];
type ResultsTableSortDirection = (typeof sortDirections)[number];
type MinimumScoreValue = (typeof minimumScoreValues)[number];
type ResultsTableState = {
  q: string;
  author: string;
  size: ResultsTableSizeFilter;
  impactMin: MinimumScoreValue | null;
  aiMin: MinimumScoreValue | null;
  qualityMin: MinimumScoreValue | null;
  overallMin: MinimumScoreValue | null;
  sort: ResultsTableSortKey;
  dir: ResultsTableSortDirection;
};
type ResultsTableAuthorOption = {
  value: string;
  label: string;
};

const unknownAuthorFilterValue = "__unknown__";
const sizeLabels: Record<ResultsTableSizeFilter, string> = {
  all: "All Sizes",
  xs: "0-25 lines",
  sm: "26-75 lines",
  md: "76-200 lines",
  lg: "200+ lines",
};
const sortLabels: Record<ResultsTableSortKey, string> = {
  mergedAt: "Newest merged",
  author: "Author",
  size: "PR size",
  impact: "Impact",
  aiLeverage: "AI Leverage",
  quality: "Quality",
  overall: "Overall score",
};
const scoreFieldByKey = {
  impact: "impactScore",
  aiLeverage: "aiLeverageScore",
  quality: "qualityScore",
  overall: "overallScore",
} as const;
const mergedDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const defaultResultsTableState: ResultsTableState = {
  q: "",
  author: "",
  size: "all",
  impactMin: null,
  aiMin: null,
  qualityMin: null,
  overallMin: null,
  sort: "overall",
  dir: "desc",
};

const parseMinimumScore = (
  value: string | null,
): MinimumScoreValue | null => {
  const parsedValue = Number(value);

  return minimumScoreValues.includes(parsedValue as MinimumScoreValue)
    ? (parsedValue as MinimumScoreValue)
    : null;
};

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

export const parseResultsTableState = (
  searchParams: SearchParamsLike,
): ResultsTableState => {
  const sort = searchParams.get("sort");
  const dir = searchParams.get("dir");
  const size = searchParams.get("size");

  return {
    q: searchParams.get("q")?.trim() ?? defaultResultsTableState.q,
    author: searchParams.get("author")?.trim() ?? defaultResultsTableState.author,
    size: sizeFilters.includes(size as ResultsTableSizeFilter)
      ? (size as ResultsTableSizeFilter)
      : defaultResultsTableState.size,
    impactMin: parseMinimumScore(searchParams.get("impactMin")),
    aiMin: parseMinimumScore(searchParams.get("aiMin")),
    qualityMin: parseMinimumScore(searchParams.get("qualityMin")),
    overallMin: parseMinimumScore(searchParams.get("overallMin")),
    sort: sortKeys.includes(sort as ResultsTableSortKey)
      ? (sort as ResultsTableSortKey)
      : defaultResultsTableState.sort,
    dir: sortDirections.includes(dir as ResultsTableSortDirection)
      ? (dir as ResultsTableSortDirection)
      : defaultResultsTableState.dir,
  };
};

export const createResultsTableQueryString = (
  state: ResultsTableState,
): string => {
  const params = new URLSearchParams();

  if (state.q) params.set("q", state.q);
  if (state.author) params.set("author", state.author);
  if (state.size !== defaultResultsTableState.size) params.set("size", state.size);
  if (state.impactMin) params.set("impactMin", String(state.impactMin));
  if (state.aiMin) params.set("aiMin", String(state.aiMin));
  if (state.qualityMin) params.set("qualityMin", String(state.qualityMin));
  if (state.overallMin) params.set("overallMin", String(state.overallMin));
  if (state.sort !== defaultResultsTableState.sort) params.set("sort", state.sort);
  if (state.dir !== defaultResultsTableState.dir) params.set("dir", state.dir);

  return params.toString();
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
    .sort((leftValue, rightValue) => leftValue.localeCompare(rightValue))
    .map((value) => ({
      value,
      label: value === unknownAuthorFilterValue ? "Unknown author" : value,
    }));
};

export const formatPullRequestMergedDate = (mergedAt: string) =>
  mergedDateFormatter.format(new Date(mergedAt));

export const getResultsTableSortDirectionForKey = (
  sort: ResultsTableSortKey,
): ResultsTableSortDirection => (sort === "author" ? "asc" : "desc");

export const getResultsTableSortLabel = (sort: ResultsTableSortKey) =>
  sortLabels[sort];

export const getResultsTableSizeLabel = (size: ResultsTableSizeFilter) =>
  sizeLabels[size];

export {
  defaultResultsTableState,
  minimumScoreValues,
  sizeFilters,
  sortKeys,
  unknownAuthorFilterValue,
  type MinimumScoreValue,
  type ResultsTableAuthorOption,
  type ResultsTableSizeFilter,
  type ResultsTableSortDirection,
  type ResultsTableSortKey,
  type ResultsTableState,
};
