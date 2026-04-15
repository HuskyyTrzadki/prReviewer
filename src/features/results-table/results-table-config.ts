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

export {
  defaultResultsTableState,
  minimumScoreValues,
  scoreFieldByKey,
  sizeFilters,
  sizeLabels,
  sortDirections,
  sortKeys,
  sortLabels,
  unknownAuthorFilterValue,
  type MinimumScoreValue,
  type ResultsTableAuthorOption,
  type ResultsTableSizeFilter,
  type ResultsTableSortDirection,
  type ResultsTableSortKey,
  type ResultsTableState,
};
