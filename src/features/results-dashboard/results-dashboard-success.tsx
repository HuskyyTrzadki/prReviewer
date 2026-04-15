import type { AnalyzeRepositorySuccess } from "@/features/pr-analysis/contracts/analysis-contracts";
import { ResultsPrPreviewCard } from "@/features/results-dashboard/results-pr-preview-card";
import { ResultsScoreBreakdownList } from "@/features/results-dashboard/results-score-breakdown-list";
import { ResultsScoreRadarChart } from "@/features/results-dashboard/results-score-radar-chart";
import { ResultsTableSection } from "@/features/results-table/results-table-section";

type ResultsDashboardSuccessProps = {
  result: AnalyzeRepositorySuccess;
};

const scoreLabels = [
  {
    description: "How meaningful and consequential the sampled changes look.",
    key: "impactScore",
    label: "Impact",
  },
  {
    description:
      "How strongly the sample suggests productive AI-assisted delivery.",
    key: "aiLeverageScore",
    label: "AI Leverage",
  },
  {
    description:
      "How focused, clear, and well-executed the merged work appears.",
    key: "qualityScore",
    label: "Quality",
  },
] as const;

export const ResultsDashboardSuccess = ({
  result,
}: ResultsDashboardSuccessProps) => {
  const topPullRequests = result.analysis.pullRequests.slice(0, 3);
  const skippedCount = result.analysis.skippedPullRequests.length;
  const sampleSize = result.analysis.summary.scoredPullRequestCount + skippedCount;

  return (
    <section className="ds-section bg-ice-blue">
      <div className="ds-container">
        <div className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="rounded-md border border-silver bg-white p-8">
              <div className="flex h-full flex-col justify-between gap-8">
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
                  <div className="space-y-3">
                    <h1 className="ds-display-2 text-left text-balance">
                      {result.repository.fullName}
                    </h1>
                    <p className="ds-body-secondary max-w-[31rem]">
                      A readable roll-up of the most recent merged PR sample,
                      balancing repository impact, AI leverage, and engineering
                      quality.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-md border border-silver bg-ice-blue px-4 py-4">
                    <p className="ds-caption text-dark-slate">Repository score</p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums text-navy">
                      {result.analysis.summary.overallScore}
                    </p>
                  </div>
                  <div className="rounded-md border border-silver bg-ice-blue px-4 py-4">
                    <p className="ds-caption text-dark-slate">Sample window</p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums text-navy">
                      {sampleSize} PRs
                    </p>
                  </div>
                  <div className="rounded-md border border-silver bg-ice-blue px-4 py-4">
                    <p className="ds-caption text-dark-slate">Live source</p>
                    <p className="mt-2 text-sm font-semibold text-navy">
                      GitHub merged pull requests
                    </p>
                  </div>
                </div>
              </div>
            </article>

            <article className="rounded-md border border-silver bg-white p-8">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-2">
                    <p className="ds-overline text-navy">Repository Summary</p>
                    <h2 className="ds-heading-3 text-[1.5rem]">
                      Score Breakdown
                    </h2>
                    <p className="ds-caption max-w-[28rem] text-dark-slate">
                      A quick visual read on how the scored PR sample balances
                      significance, AI assistance, and code quality.
                    </p>
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
                      {sampleSize}
                    </p>
                  </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(17rem,1.05fr)] lg:items-stretch">
                  <ResultsScoreBreakdownList
                    items={scoreLabels.map((scoreLabel) => ({
                      description: scoreLabel.description,
                      label: scoreLabel.label,
                      value: result.analysis.summary[scoreLabel.key],
                    }))}
                  />

                  <div className="flex h-full rounded-md border border-silver bg-ice-blue/60 px-4 py-4 sm:px-5">
                    <ResultsScoreRadarChart
                      aiLeverageScore={result.analysis.summary.aiLeverageScore}
                      impactScore={result.analysis.summary.impactScore}
                      qualityScore={result.analysis.summary.qualityScore}
                    />
                  </div>
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
              <p className="ds-caption text-dark-slate">Then continue with the full PR list below.</p>
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

          <ResultsTableSection result={result} />
        </div>
      </div>
    </section>
  );
};
