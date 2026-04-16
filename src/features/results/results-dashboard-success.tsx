import Link from "next/link";

import type { AnalyzeRepositorySuccess } from "@/features/pr-analysis/contracts/analysis-contracts";
import { ResultsPrPreviewCard } from "@/features/results/results-pr-preview-card";
import { ResultsScoreBreakdownList } from "@/features/results/results-score-breakdown-list";
import { ResultsScoreRadarChart } from "@/features/results/results-score-radar-chart";
import { ResultsTableSection } from "@/features/results/results-table-section";
import { ScoreCircle } from "@/shared/ui/score-circle";

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
          <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
            <article className="rounded-md border border-silver bg-white p-8">
              <div className="flex h-full flex-col justify-center gap-8 py-2">
                <div className="space-y-6 text-center">
                  <div className="space-y-4">
                    <h1 className="ds-display-2 text-balance">
                      {result.repository.fullName}
                    </h1>
                    <div className="space-y-3">
                      <p className="ds-overline text-navy">Repository Score</p>
                      <div className="flex justify-center">
                        <ScoreCircle
                          className="animate-score-circle-pop"
                          size="lg"
                          value={result.analysis.summary.overallScore}
                        />
                      </div>
                    </div>
                    <p className="mx-auto max-w-[31rem] ds-body-secondary">
                      A compact scorecard built from the latest merged PR sample,
                      weighing how meaningful the work is, how much AI seems to
                      accelerate it, and how cleanly it lands.
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
                    className="ds-button-primary"
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

          <article className="rounded-md border border-silver bg-white p-8">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="ds-overline text-navy">Next Repository</p>
                <h2 className="ds-heading-4 text-[1.5rem]">
                  Run another PR analysis
                </h2>
                <p className="ds-caption max-w-[38rem] text-dark-slate">
                  Head back to the homepage, drop in another public GitHub
                  repository, and compare how its merged PR sample scores.
                </p>
              </div>

              <Link className="ds-button-primary" href="/">
                Analyze another repository
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
