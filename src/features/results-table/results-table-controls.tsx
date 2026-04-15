import type { ReactNode } from "react";

import {
  getResultsTableSizeLabel,
  minimumScoreValues,
  sizeFilters,
  type ResultsTableAuthorOption,
  type ResultsTableSizeFilter,
  type ResultsTableState,
} from "@/features/results-table/results-table-state";

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

const scoreFilterGroups = [
  { field: "impactMin", label: "Impact" },
  { field: "aiMin", label: "AI Leverage" },
  { field: "qualityMin", label: "Quality" },
  { field: "overallMin", label: "Overall" },
] as const;

const FilterField = ({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) => (
  <label className="space-y-2">
    <span className="ds-caption text-dark-slate">{label}</span>
    {children}
  </label>
);

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
  const hasActiveFilters =
    state.q ||
    state.author ||
    state.size !== "all" ||
    state.impactMin ||
    state.aiMin ||
    state.qualityMin ||
    state.overallMin;

  return (
    <div className="rounded-md border border-silver bg-ice-blue p-4 sm:p-5">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_repeat(6,minmax(0,1fr))]">
        <FilterField label="Search Pull Requests">
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
        </FilterField>

        <FilterField label="Author">
          <select
            className="ds-select"
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
        </FilterField>

        <FilterField label="PR Size">
          <select
            className="ds-select"
            name="sizeFilter"
            onChange={(event) =>
              onSizeChange(event.target.value as ResultsTableSizeFilter)
            }
            value={state.size}
          >
            {sizeFilters.map((sizeFilter) => (
              <option key={sizeFilter} value={sizeFilter}>
                {getResultsTableSizeLabel(sizeFilter)}
              </option>
            ))}
          </select>
        </FilterField>

        {scoreFilterGroups.map((scoreFilterGroup) => (
          <FilterField key={scoreFilterGroup.field} label={scoreFilterGroup.label}>
            <select
              className="ds-select"
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
          </FilterField>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="ds-caption text-dark-slate">
          {isPending ? "Updating the PR list…" : "Use filters to narrow the sample."}
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
  );
};
