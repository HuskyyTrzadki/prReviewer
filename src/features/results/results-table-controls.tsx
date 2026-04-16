import {
  getResultsTableSizeLabel,
  isResultsTableSizeFilter,
  minimumScoreValues,
  minimumScoreFields,
  sizeFilters,
  type MinimumScoreField,
  type ResultsTableAuthorOption,
  type ResultsTableSizeFilter,
  type ResultsTableState,
} from "@/features/results/results-table-state";
import {
  ResultsTableField,
  ResultsTableSelectField,
} from "@/features/results/results-table-field";

type ResultsTableControlsProps = {
  authorOptions: ResultsTableAuthorOption[];
  isPending: boolean;
  onAuthorChange: (author: string) => void;
  onClear: () => void;
  onMinimumScoreChange: (
    field: "impactMin" | "aiMin" | "qualityMin" | "overallMin",
    value: number | null,
  ) => void;
  onQueryChange: (query: string) => void;
  onSizeChange: (size: ResultsTableSizeFilter) => void;
  state: ResultsTableState;
};

const scoreFilterLabelByField: Record<MinimumScoreField, string> = {
  impactMin: "Impact",
  aiMin: "AI Leverage",
  qualityMin: "Quality",
  overallMin: "Overall",
};

const scoreFilterGroups = minimumScoreFields.map((field) => ({
  field,
  label: scoreFilterLabelByField[field],
}));

export const ResultsTableControls = ({
  authorOptions,
  isPending,
  onAuthorChange,
  onClear,
  onMinimumScoreChange,
  onQueryChange,
  onSizeChange,
  state,
}: ResultsTableControlsProps) => {
  const hasActiveFilters = Boolean(
    state.q ||
      state.author ||
      state.size !== "all" ||
      state.impactMin ||
      state.aiMin ||
      state.qualityMin ||
      state.overallMin,
  );
  const activeFilterCount = [
    Boolean(state.q),
    Boolean(state.author),
    state.size !== "all",
    Boolean(state.impactMin),
    Boolean(state.aiMin),
    Boolean(state.qualityMin),
    Boolean(state.overallMin),
  ].filter(Boolean).length;

  return (
    <div className="rounded-md border border-silver bg-ice-blue/80 p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-silver pb-4">
        <div className="space-y-1">
          <p className="ds-overline text-navy">Filters</p>
          <h3 className="text-base font-semibold text-navy">
            Refine the scored PR sample
          </h3>
          <p className="ds-caption text-dark-slate">
            Search by title or summary, then narrow by author, size, and score thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <p className="ds-caption text-dark-slate">
            {hasActiveFilters ? `${activeFilterCount} active filters` : "No filters applied"}
          </p>
          <button
            className="ds-button-secondary h-10 px-4 text-sm"
            disabled={!hasActiveFilters}
            onClick={onClear}
            type="button"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-8">
        <ResultsTableField
          className="max-w-[30rem]"
          label="Search Pull Requests"
        >
          <input
            autoComplete="off"
            className="ds-input"
            name="pullRequestSearch"
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search titles or summaries…"
            spellCheck={false}
            type="search"
            value={state.q}
          />
        </ResultsTableField>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <ResultsTableField label="Author">
            <ResultsTableSelectField>
              <select
                className="ds-select appearance-none pr-11"
                name="authorFilter"
                onChange={(event) => onAuthorChange(event.target.value)}
                value={state.author}
              >
                <option value="">All Authors</option>
                {authorOptions.map((authorOption) => (
                  <option key={authorOption.value} value={authorOption.value}>
                    {authorOption.label}
                  </option>
                ))}
              </select>
            </ResultsTableSelectField>
          </ResultsTableField>

          <ResultsTableField label="PR Size">
            <ResultsTableSelectField>
              <select
                className="ds-select appearance-none pr-11"
                name="sizeFilter"
                onChange={(event) => {
                  const nextSize = event.target.value;

                  if (isResultsTableSizeFilter(nextSize)) {
                    onSizeChange(nextSize);
                  }
                }}
                value={state.size}
              >
                {sizeFilters.map((sizeFilter) => (
                  <option key={sizeFilter} value={sizeFilter}>
                    {getResultsTableSizeLabel(sizeFilter)}
                  </option>
                ))}
              </select>
            </ResultsTableSelectField>
          </ResultsTableField>

          {scoreFilterGroups.map((scoreFilterGroup) => (
            <ResultsTableField
              key={scoreFilterGroup.field}
              label={scoreFilterGroup.label}
            >
              <ResultsTableSelectField>
                <select
                  className="ds-select appearance-none pr-11"
                  name={scoreFilterGroup.field}
                  onChange={(event) =>
                    onMinimumScoreChange(
                      scoreFilterGroup.field,
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  value={state[scoreFilterGroup.field] ?? ""}
                >
                  <option value="">Any Score</option>
                  {minimumScoreValues.map((minimumScoreValue) => (
                    <option key={minimumScoreValue} value={minimumScoreValue}>
                      {minimumScoreValue}+
                    </option>
                  ))}
                </select>
              </ResultsTableSelectField>
            </ResultsTableField>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="ds-caption text-dark-slate">
          {isPending
            ? "Updating the PR list…"
            : "Tip: start with Overall or Quality if you want a cleaner shortlist first."}
        </p>
      </div>
    </div>
  );
};
