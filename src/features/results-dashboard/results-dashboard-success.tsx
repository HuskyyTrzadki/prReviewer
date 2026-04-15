import type { AnalyzeRepositorySuccess } from "@/features/pr-analysis/contracts/analysis-contracts";

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
                    Real analysis from the latest sample of merged pull requests.
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
                      {result.analysis.pullRequests.length}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {scoreLabels.map((scoreLabel) => (
                    <div key={scoreLabel.key}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <span className="text-sm font-medium text-navy">
                          {scoreLabel.label}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-navy">
                          {result.analysis.summary[scoreLabel.key]}
                        </span>
                      </div>
                      <div className="h-3 rounded-full bg-soft-indigo">
                        <div
                          className="h-full rounded-full bg-indigo-violet"
                          style={{
                            width: `${result.analysis.summary[scoreLabel.key]}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
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
                <article
                  className="rounded-md border border-silver bg-ice-blue px-5 py-5"
                  key={pullRequest.number}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <p className="ds-caption text-dark-slate">
                        PR #{pullRequest.number} · {pullRequest.authorLogin ?? "Unknown author"}
                      </p>
                      <h3 className="text-lg font-semibold leading-7 text-navy">
                        {pullRequest.title}
                      </h3>
                      <p className="ds-body-secondary">{pullRequest.summary}</p>
                    </div>
                    <div className="shrink-0 rounded-md border border-silver bg-white px-4 py-3 text-right">
                      <p className="ds-caption text-dark-slate">Overall</p>
                      <p className="mt-1 text-3xl font-semibold tabular-nums text-navy">
                        {pullRequest.overallScore}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};
