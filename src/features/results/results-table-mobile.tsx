import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";
import { ResultsTableScorePill } from "@/features/results/results-table-score-pill";
import { formatPullRequestMergedDate } from "@/features/results/results-table-state";

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
        <div className="space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 space-y-3">
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
            </div>

            <div className="shrink-0 rounded-md border border-soft-indigo bg-soft-indigo px-4 py-3 text-center">
              <p className="ds-caption text-dark-slate">Overall</p>
              <p className="mt-1 text-2xl font-semibold leading-none tabular-nums text-navy">
                {pullRequest.overallScore}
              </p>
            </div>
          </div>

          <p className="ds-body-secondary">{pullRequest.summary}</p>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="ds-caption text-dark-slate">
              {pullRequest.authorLogin ?? "Unknown author"}
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

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">Author</dt>
              <dd className="mt-1 text-sm font-semibold text-navy">
                {pullRequest.authorLogin ?? "Unknown author"}
              </dd>
            </div>
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">PR Size</dt>
              <dd className="mt-1 text-sm font-semibold tabular-nums text-navy">
                {pullRequest.additions + pullRequest.deletions} lines across{" "}
                {pullRequest.changedFiles}{" "}
                {pullRequest.changedFiles === 1 ? "file" : "files"}
              </dd>
            </div>
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">Diff Stats</dt>
              <dd className="mt-1 flex items-center gap-3 text-sm font-semibold tabular-nums">
                <span className="text-success-green">+{pullRequest.additions}</span>
                <span className="text-error-red">-{pullRequest.deletions}</span>
              </dd>
            </div>
            <div className="rounded-md border border-silver bg-ice-blue px-4 py-3">
              <dt className="ds-caption text-dark-slate">Merged</dt>
              <dd className="mt-1 text-sm font-semibold text-navy">
                {formatPullRequestMergedDate(pullRequest.mergedAt)}
              </dd>
            </div>
          </dl>

          <div className="flex flex-wrap gap-2.5">
            {scoreGroups(pullRequest).map((scoreGroup) => (
              <ResultsTableScorePill
                key={scoreGroup.label}
                label={scoreGroup.label}
                value={scoreGroup.value}
              />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              className="ds-button-primary h-10 px-4 text-sm"
              href={pullRequest.htmlUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open PR
            </a>
            <a
              className="ds-button-secondary h-10 px-4 text-sm"
              href={`${pullRequest.htmlUrl}/files`}
              rel="noreferrer"
              target="_blank"
            >
              View diff
            </a>
          </div>
        </div>
      </article>
    ))}
  </div>
);
