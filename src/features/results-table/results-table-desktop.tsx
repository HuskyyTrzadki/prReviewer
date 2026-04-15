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
      {isActive ? (sortDirection === "desc" ? "↓" : "↑") : "↕"}
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
    <table className="w-full border-collapse">
      <caption className="sr-only">Analyzed pull requests with sortable score columns.</caption>
      <thead>
        <tr className="border-b border-silver bg-ice-blue">
          <th className="px-4 py-3 text-left text-sm font-semibold text-navy" scope="col">
            Pull Request
          </th>
          {sortColumns.map((sortColumn) => (
            <th className="px-4 py-3 text-left" key={sortColumn.key} scope="col">
              <SortHeaderButton
                isActive={sort === sortColumn.key}
                label={sortColumn.label}
                onClick={() => onSortChange(sortColumn.key)}
                sortDirection={sortDirection}
              />
            </th>
          ))}
          <th className="px-4 py-3 text-left text-sm font-semibold text-navy" scope="col">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {pullRequests.map((pullRequest) => (
          <tr className="border-b border-silver last:border-b-0" key={pullRequest.number}>
            <td className="min-w-0 px-4 py-4 align-top">
              <div className="min-w-0 space-y-2">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-sm font-semibold text-navy">
                    PR #{pullRequest.number}
                  </span>
                  <span className="ds-caption text-dark-slate">
                    {pullRequest.changedFiles} files · +{pullRequest.additions}/-
                    {pullRequest.deletions}
                  </span>
                </div>
                <p className="line-clamp-2 text-base font-semibold leading-6 text-navy">
                  {pullRequest.title}
                </p>
                <p className="line-clamp-2 text-sm leading-6 text-dark-slate">
                  {pullRequest.summary}
                </p>
              </div>
            </td>
            <td className="px-4 py-4 align-top text-sm text-dark-slate">
              {formatPullRequestMergedDate(pullRequest.mergedAt)}
            </td>
            <td className="px-4 py-4 align-top text-sm text-dark-slate">
              {pullRequest.authorLogin ?? "Unknown author"}
            </td>
            <td className="px-4 py-4 align-top text-sm tabular-nums text-dark-slate">
              {pullRequest.additions + pullRequest.deletions}
            </td>
            <td className="px-4 py-4 align-top text-sm font-semibold tabular-nums text-navy">
              {pullRequest.impactScore}
            </td>
            <td className="px-4 py-4 align-top text-sm font-semibold tabular-nums text-navy">
              {pullRequest.aiLeverageScore}
            </td>
            <td className="px-4 py-4 align-top text-sm font-semibold tabular-nums text-navy">
              {pullRequest.qualityScore}
            </td>
            <td className="px-4 py-4 align-top text-sm font-semibold tabular-nums text-navy">
              {pullRequest.overallScore}
            </td>
            <td className="px-4 py-4 align-top">
              <div className="flex flex-col items-start gap-2">
                <a
                  className="text-sm font-medium text-indigo-violet transition-colors duration-150 hover:text-indigo-violet-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
                  href={pullRequest.htmlUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open PR
                </a>
                <a
                  className="text-sm font-medium text-indigo-violet transition-colors duration-150 hover:text-indigo-violet-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
                  href={`${pullRequest.htmlUrl}/files`}
                  rel="noreferrer"
                  target="_blank"
                >
                  View Diff
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
