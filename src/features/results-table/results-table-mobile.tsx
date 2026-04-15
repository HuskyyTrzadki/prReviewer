import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";
import { ResultsTableScorePill } from "@/features/results-table/results-table-score-pill";
import { formatPullRequestMergedDate } from "@/features/results-table/results-table-state";

type ResultsTableMobileProps = {
  pullRequests: ScoredPullRequest[];
};

const scoreGroups = (pullRequest: ScoredPullRequest) => [
  { label: "Impact", value: pullRequest.impactScore },
  { label: "AI Leverage", value: pullRequest.aiLeverageScore },
  { label: "Quality", value: pullRequest.qualityScore },
  { label: "Overall", value: pullRequest.overallScore },
];

export const ResultsTableMobile = ({
  pullRequests,
}: ResultsTableMobileProps) => (
  <div className="space-y-4 lg:hidden">
    {pullRequests.map((pullRequest) => (
      <article
        className="rounded-md border border-silver bg-white p-5"
        key={pullRequest.number}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-sm font-semibold text-navy">
                PR #{pullRequest.number}
              </span>
              <span className="ds-caption text-dark-slate">
                {formatPullRequestMergedDate(pullRequest.mergedAt)}
              </span>
            </div>
            <h3 className="text-base font-semibold leading-6 text-navy">
              {pullRequest.title}
            </h3>
            <p className="ds-body-secondary">{pullRequest.summary}</p>
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">Author</dt>
              <dd className="mt-1 text-sm font-semibold text-navy">
                {pullRequest.authorLogin ?? "Unknown author"}
              </dd>
            </div>
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">Size</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-navy">
                {pullRequest.changedFiles} files · {pullRequest.additions + pullRequest.deletions} lines
              </dd>
            </div>
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">Diff Stats</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-navy">
                +{pullRequest.additions} / -{pullRequest.deletions}
              </dd>
            </div>
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">Merged</dt>
              <dd className="mt-1 text-sm font-semibold text-navy">
                {formatPullRequestMergedDate(pullRequest.mergedAt)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2">
            {scoreGroups(pullRequest).map((scoreGroup) => (
              <ResultsTableScorePill
                key={scoreGroup.label}
                label={scoreGroup.label}
                value={scoreGroup.value}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4">
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
        </div>
      </article>
    ))}
  </div>
);
