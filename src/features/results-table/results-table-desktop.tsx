import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";
import {
  formatPullRequestMergedDate,
  getResultsTableSortLabel,
  type ResultsTableSortDirection,
  type ResultsTableSortKey,
} from "@/features/results-table/results-table-state";

type ResultsTableDesktopProps = {
  onSortChange: (sort: ResultsTableSortKey) => void;
  pullRequests: ScoredPullRequest[];
  sort: ResultsTableSortKey;
  sortDirection: ResultsTableSortDirection;
};

const sortColumns = [
  { key: "mergedAt", label: "Merged" },
  { key: "author", label: "Author" },
  { key: "size", label: "Size" },
  { key: "impact", label: "Impact" },
  { key: "aiLeverage", label: "AI Leverage" },
  { key: "quality", label: "Quality" },
  { key: "overall", label: "Overall" },
] as const;

const getSortIndicator = ({
  isActive,
  sortDirection,
}: {
  isActive: boolean;
  sortDirection: ResultsTableSortDirection;
}) => {
  if (!isActive) {
    return "↕";
  }

  return sortDirection === "desc" ? "↓" : "↑";
};

const SortHeaderButton = ({
  isActive,
  label,
  onClick,
  sortDirection,
}: {
  isActive: boolean;
  label: string;
  onClick: () => void;
  sortDirection: ResultsTableSortDirection;
}) => (
  <button
    className="inline-flex items-center gap-2 text-left text-sm font-semibold text-navy transition-colors duration-150 hover:text-indigo-violet focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
    onClick={onClick}
    type="button"
  >
    <span>{label}</span>
    <span aria-hidden="true" className="text-cool-gray">
      {getSortIndicator({ isActive, sortDirection })}
    </span>
  </button>
);

export const ResultsTableDesktop = ({
  onSortChange,
  pullRequests,
  sort,
  sortDirection,
}: ResultsTableDesktopProps) => (
  <div className="hidden overflow-hidden rounded-md border border-silver bg-white lg:block">
    <table className="w-full table-fixed border-collapse">
      <caption className="sr-only">Analyzed pull requests with sortable score columns.</caption>
      <colgroup>
        <col className="w-[29%]" />
        <col className="w-[9%]" />
        <col className="w-[9%]" />
        <col className="w-[8%]" />
        <col className="w-[8%]" />
        <col className="w-[9%]" />
        <col className="w-[8%]" />
        <col className="w-[8%]" />
        <col className="w-[12%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-silver bg-ice-blue/70">
          <th className="px-5 py-4 text-left text-sm font-semibold text-navy" scope="col">
            Pull Request
          </th>
          {sortColumns.map((sortColumn) => (
            <th
              className="border-l border-silver/70 px-4 py-4 text-left"
              key={sortColumn.key}
              scope="col"
            >
              <SortHeaderButton
                isActive={sort === sortColumn.key}
                label={sortColumn.label}
                onClick={() => onSortChange(sortColumn.key)}
                sortDirection={sortDirection}
              />
            </th>
          ))}
          <th
            className="border-l border-silver/70 px-5 py-4 text-center text-sm font-semibold text-navy"
            scope="col"
          >
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {pullRequests.map((pullRequest) => (
          <tr
            className="border-b border-silver transition-colors duration-150 hover:bg-ice-blue/40 last:border-b-0"
            key={pullRequest.number}
          >
            <td className="min-w-0 px-5 py-5 align-top">
              <div className="min-w-0 space-y-2.5">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="text-sm font-semibold text-navy">
                    PR #{pullRequest.number}
                  </span>
                  <span className="ds-caption text-dark-slate">
                    {pullRequest.changedFiles}{" "}
                    {pullRequest.changedFiles === 1 ? "file" : "files"}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-success-green">
                    +{pullRequest.additions}
                  </span>
                  <span className="text-sm font-medium tabular-nums text-error-red">
                    -{pullRequest.deletions}
                  </span>
                </div>
                <p className="line-clamp-2 text-lg font-semibold leading-7 text-navy">
                  {pullRequest.title}
                </p>
                <p className="line-clamp-2 max-w-[27rem] text-sm leading-6 text-dark-slate">
                  {pullRequest.summary}
                </p>
              </div>
            </td>
            <td className="border-l border-silver/70 px-4 py-5 align-top text-sm leading-6 text-dark-slate">
              {formatPullRequestMergedDate(pullRequest.mergedAt)}
            </td>
            <td className="border-l border-silver/70 px-4 py-5 align-top text-sm leading-6 text-dark-slate">
              {pullRequest.authorLogin ?? "Unknown author"}
            </td>
            <td className="border-l border-silver/70 px-4 py-5 align-top">
              <div className="space-y-1">
                <p className="text-base font-semibold tabular-nums text-navy">
                  {pullRequest.additions + pullRequest.deletions}
                </p>
                <p className="ds-caption text-dark-slate">
                  {pullRequest.changedFiles}{" "}
                  {pullRequest.changedFiles === 1 ? "file" : "files"}
                </p>
              </div>
            </td>
            <td className="border-l border-silver/70 px-4 py-5 align-top text-base font-semibold tabular-nums text-navy">
              {pullRequest.impactScore}
            </td>
            <td className="border-l border-silver/70 px-4 py-5 align-top text-base font-semibold tabular-nums text-navy">
              {pullRequest.aiLeverageScore}
            </td>
            <td className="border-l border-silver/70 px-4 py-5 align-top text-base font-semibold tabular-nums text-navy">
              {pullRequest.qualityScore}
            </td>
            <td className="border-l border-silver/70 px-4 py-5 align-top text-center">
              <span className="inline-flex min-w-[3.25rem] items-center justify-center rounded-full bg-soft-indigo px-3 py-2 text-sm font-semibold tabular-nums text-navy">
                {pullRequest.overallScore}
              </span>
            </td>
            <td className="border-l border-silver/70 px-5 py-5 align-top">
              <div className="flex flex-col items-stretch gap-2">
                <a
                  className="ds-button-primary h-10 w-full px-3 text-sm"
                  href={pullRequest.htmlUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open PR
                </a>
                <a
                  className="ds-button-secondary h-10 w-full px-3 text-sm"
                  href={`${pullRequest.htmlUrl}/files`}
                  rel="noreferrer"
                  target="_blank"
                >
                  View diff
                </a>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    <div className="sr-only" aria-live="polite">
      Sorted by {getResultsTableSortLabel(sort)}.
    </div>
  </div>
);
