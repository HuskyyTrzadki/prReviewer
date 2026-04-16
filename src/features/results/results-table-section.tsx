"use client";

import { useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import type { AnalyzeRepositorySuccess } from "@/features/pr-analysis/contracts/analysis-contracts";
import { ResultsTableControls } from "@/features/results/results-table-controls";
import { ResultsTableDesktop } from "@/features/results/results-table-desktop";
import { ResultsTableMobile } from "@/features/results/results-table-mobile";
import {
  createResultsTableQueryString,
  defaultResultsTableState,
  filterAndSortPullRequests,
  getResultsTableAuthorOptions,
  getResultsTableSortDirectionForKey,
  getResultsTableSortLabel,
  type ResultsTableSizeFilter,
  type ResultsTableSortKey,
  parseResultsTableState,
} from "@/features/results/results-table-state";

type ResultsTableSectionProps = {
  result: AnalyzeRepositorySuccess;
};

export const ResultsTableSection = ({
  result,
}: ResultsTableSectionProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const tableState = parseResultsTableState(searchParams);
  const authorOptions = useMemo(
    () => getResultsTableAuthorOptions(result.analysis.pullRequests),
    [result.analysis.pullRequests],
  );
  const visiblePullRequests = useMemo(
    () => filterAndSortPullRequests(result.analysis.pullRequests, tableState),
    [result.analysis.pullRequests, tableState],
  );

  const getNextSortDirection = (sort: ResultsTableSortKey) => {
    if (tableState.sort !== sort) {
      return getResultsTableSortDirectionForKey(sort);
    }

    return tableState.dir === "desc" ? "asc" : "desc";
  };

  const updateState = (statePatch: Partial<typeof tableState>) => {
    const nextState = { ...tableState, ...statePatch };
    const queryString = createResultsTableQueryString(nextState);
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;

    startTransition(() => {
      router.replace(nextUrl, { scroll: false });
    });
  };

  return (
    <article className="rounded-md border border-silver bg-white p-6 sm:p-8">
      <div className="flex flex-col gap-3 border-b border-silver pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="ds-overline text-navy">Pull Request Results</p>
            <h2 className="ds-heading-3 text-[1.5rem]">
              Sort, filter, and inspect the PR sample behind the score
            </h2>
            <p className="ds-caption max-w-[36rem] text-dark-slate">
              Use search and filters to move from a quick score overview to the
              individual pull requests shaping it.
            </p>
          </div>
          <p className="ds-caption text-dark-slate">
            Showing {visiblePullRequests.length} of{" "}
            {result.analysis.pullRequests.length} scored pull requests
          </p>
        </div>
        <p className="ds-caption text-dark-slate">
          Sorted by {getResultsTableSortLabel(tableState.sort)}. Tap a column to
          change the order.
        </p>
      </div>

      <div className="mt-6 space-y-6">
        <ResultsTableControls
          authorOptions={authorOptions}
          isPending={isPending}
          onAuthorChange={(author) => updateState({ author })}
          onClear={() => updateState(defaultResultsTableState)}
          onMinimumScoreChange={(field, value) => updateState({ [field]: value })}
          onQueryChange={(q) => updateState({ q })}
          onSizeChange={(size: ResultsTableSizeFilter) => updateState({ size })}
          state={tableState}
        />

        {visiblePullRequests.length === 0 ? (
          <div className="rounded-md border border-silver bg-ice-blue px-6 py-8 text-center">
            <p className="ds-overline text-navy">No Matching Pull Requests</p>
            <h3 className="mt-2 text-lg font-semibold text-navy">
              These filters are narrower than the scored sample.
            </h3>
            <p className="mt-2 ds-body-secondary">
              Clear one or two filters to bring pull requests back into view.
            </p>
          </div>
        ) : (
          <>
            <ResultsTableDesktop
              onSortChange={(sort: ResultsTableSortKey) =>
                updateState({
                  sort,
                  dir: getNextSortDirection(sort),
                })
              }
              pullRequests={visiblePullRequests}
              sort={tableState.sort}
              sortDirection={tableState.dir}
            />
            <ResultsTableMobile pullRequests={visiblePullRequests} />
          </>
        )}
      </div>
    </article>
  );
};
