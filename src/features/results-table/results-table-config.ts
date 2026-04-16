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
const minimumScoreFields = [
  "impactMin",
  "aiMin",
  "qualityMin",
  "overallMin",
] as const;

type ResultsTableSizeFilter = (typeof sizeFilters)[number];
type ResultsTableSortKey = (typeof sortKeys)[number];
type ResultsTableSortDirection = (typeof sortDirections)[number];
type MinimumScoreValue = (typeof minimumScoreValues)[number];
type MinimumScoreField = (typeof minimumScoreFields)[number];
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

const isResultsTableSizeFilter = (
  value: string | null,
): value is ResultsTableSizeFilter =>
  value !== null && sizeFilters.includes(value as ResultsTableSizeFilter);

const isResultsTableSortKey = (
  value: string | null,
): value is ResultsTableSortKey =>
  value !== null && sortKeys.includes(value as ResultsTableSortKey);

const isResultsTableSortDirection = (
  value: string | null,
): value is ResultsTableSortDirection =>
  value !== null && sortDirections.includes(value as ResultsTableSortDirection);

const isMinimumScoreValue = (
  value: number,
): value is MinimumScoreValue => minimumScoreValues.includes(value as MinimumScoreValue);

export {
  defaultResultsTableState,
  isMinimumScoreValue,
  isResultsTableSizeFilter,
  isResultsTableSortDirection,
  isResultsTableSortKey,
  minimumScoreValues,
  minimumScoreFields,
  scoreFieldByKey,
  sizeFilters,
  sizeLabels,
  sortDirections,
  sortKeys,
  sortLabels,
  unknownAuthorFilterValue,
  type MinimumScoreField,
  type MinimumScoreValue,
  type ResultsTableAuthorOption,
  type ResultsTableSizeFilter,
  type ResultsTableSortDirection,
  type ResultsTableSortKey,
  type ResultsTableState,
};
