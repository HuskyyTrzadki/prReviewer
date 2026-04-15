import type { AnalyzeRepositorySuccess } from "@/features/pr-analysis/contracts/analysis-contracts";
import { ResultsPrPreviewCard } from "@/features/results-dashboard/results-pr-preview-card";
import { ResultsScoreBar } from "@/features/results-dashboard/results-score-bar";

type ResultsDashboardSuccessProps = {
  result: AnalyzeRepositorySuccess;
};

const scoreLabels = [
  {
    key: "impactScore",
    label: "Impact",
  },
  {
    key: "aiLeverageScore",
    label: "AI Leverage",
  },
  {
    key: "qualityScore",
    label: "Quality",
  },
] as const;

export const ResultsDashboardSuccess = ({
  result,
}: ResultsDashboardSuccessProps) => {
  const topPullRequests = result.analysis.pullRequests.slice(0, 3);
  const skippedCount = result.analysis.skippedPullRequests.length;

  return (
    <section className="ds-section bg-ice-blue">
      <div className="ds-container">
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-md border border-silver bg-white p-8">
              <div className="space-y-4">
                <p className="ds-overline text-navy">Repository Score</p>
                <div className="flex items-end gap-3">
                  <span className="font-serif text-[4.5rem] leading-none tracking-[-0.04em] text-navy tabular-nums">
                    {result.analysis.summary.overallScore}
                  </span>
                  <span className="pb-2 text-base font-medium text-dark-slate">
                    / 100
                  </span>
                </div>
                <div className="space-y-2">
                  <h1 className="ds-display-2 text-left text-balance">
                    {result.repository.fullName}
                  </h1>
                  <p className="ds-body-secondary">
                    Real analysis from the latest sample of merged pull requests,
                    rolled up into one readable repository score.
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-md border border-silver bg-white p-8">
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="ds-overline text-navy">Repository Summary</p>
                    <h2 className="ds-heading-3 text-[1.5rem]">
                      Score Breakdown
                    </h2>
                  </div>
                  <a
                    className="ds-button-secondary"
                    href={result.repository.canonicalUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Open on GitHub
                  </a>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-md border border-silver bg-ice-blue px-4 py-4">
                    <p className="ds-caption text-dark-slate">Scored PRs</p>
                    <p className="mt-2 text-3xl font-semibold tabular-nums text-navy">
                      {result.analysis.summary.scoredPullRequestCount}
                    </p>
                  </div>
                  <div className="rounded-md border border-silver bg-ice-blue px-4 py-4">
                    <p className="ds-caption text-dark-slate">Skipped PRs</p>
                    <p className="mt-2 text-3xl font-semibold tabular-nums text-navy">
                      {result.analysis.summary.skippedPullRequestCount}
                    </p>
                  </div>
                  <div className="rounded-md border border-silver bg-ice-blue px-4 py-4">
                    <p className="ds-caption text-dark-slate">Sample size</p>
                    <p className="mt-2 text-3xl font-semibold tabular-nums text-navy">
                      {result.analysis.summary.scoredPullRequestCount + skippedCount}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {scoreLabels.map((scoreLabel) => (
                    <ResultsScoreBar
                      key={scoreLabel.key}
                      label={scoreLabel.label}
                      value={result.analysis.summary[scoreLabel.key]}
                    />
                  ))}
                </div>

                {skippedCount > 0 ? (
                  <p className="ds-caption text-dark-slate">
                    {skippedCount} pull request
                    {skippedCount === 1 ? "" : "s"} skipped during scoring. The
                    repository score only uses successfully scored pull requests.
                  </p>
                ) : null}
              </div>
            </article>
          </div>

          <article className="rounded-md border border-silver bg-white p-8">
            <div className="flex flex-col gap-3 border-b border-silver pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="space-y-2">
                <p className="ds-overline text-navy">Top Pull Requests</p>
                <h2 className="ds-heading-3 text-[1.5rem]">
                  A quick read on what drove the repository score
                </h2>
              </div>
              <p className="ds-caption text-dark-slate">
                Full sorting and filtering arrives in the next dashboard step.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {topPullRequests.map((pullRequest) => (
                <ResultsPrPreviewCard
                  key={pullRequest.number}
                  pullRequest={pullRequest}
                />
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
