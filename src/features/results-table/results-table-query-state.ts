import {
  defaultResultsTableState,
  isMinimumScoreValue,
  isResultsTableSizeFilter,
  isResultsTableSortDirection,
  isResultsTableSortKey,
  sizeLabels,
  sortLabels,
  type MinimumScoreValue,
  type ResultsTableSizeFilter,
  type ResultsTableSortDirection,
  type ResultsTableSortKey,
  type ResultsTableState,
} from "@/features/results-table/results-table-config";

type SearchParamsLike = Pick<URLSearchParams, "get">;

const mergedDateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const parseMinimumScore = (value: string | null): MinimumScoreValue | null => {
  const parsedValue = Number(value);

  return isMinimumScoreValue(parsedValue) ? parsedValue : null;
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
    size: isResultsTableSizeFilter(size) ? size : defaultResultsTableState.size,
    impactMin: parseMinimumScore(searchParams.get("impactMin")),
    aiMin: parseMinimumScore(searchParams.get("aiMin")),
    qualityMin: parseMinimumScore(searchParams.get("qualityMin")),
    overallMin: parseMinimumScore(searchParams.get("overallMin")),
    sort: isResultsTableSortKey(sort) ? sort : defaultResultsTableState.sort,
    dir: isResultsTableSortDirection(dir) ? dir : defaultResultsTableState.dir,
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

export const formatPullRequestMergedDate = (mergedAt: string) =>
  mergedDateFormatter.format(new Date(mergedAt));

export const getResultsTableSortDirectionForKey = (
  sort: ResultsTableSortKey,
): ResultsTableSortDirection => (sort === "author" ? "asc" : "desc");

export const getResultsTableSortLabel = (sort: ResultsTableSortKey) =>
  sortLabels[sort];

export const getResultsTableSizeLabel = (size: ResultsTableSizeFilter) =>
  sizeLabels[size];
