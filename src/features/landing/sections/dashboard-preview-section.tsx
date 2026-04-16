import { previewMetrics, previewPullRequests } from "./landing-sections.data";
import { ScoreCircle } from "@/shared/ui/score-circle";

export const DashboardPreviewSection = () => {
  return (
    <section
      aria-labelledby="dashboard-preview-title"
      className="ds-deferred-section ds-section bg-white scroll-mt-24"
      id="dashboard-preview"
    >
      <div className="ds-container">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <p className="ds-overline text-navy">Dashboard Preview</p>
          <h2 className="ds-display-2 text-balance" id="dashboard-preview-title">
            A Results View That Feels Closer to a Review Tool Than a Marketing Mock.
          </h2>
          <p className="ds-body mx-auto max-w-[44rem]">
            Repository-level signal sits next to pull request detail so the score
            stays explainable when someone asks what actually drove it.
          </p>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-md border border-silver bg-white">
          <div aria-hidden="true" className="absolute inset-x-8 top-0 h-px bg-soft-indigo" />

          <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
            <aside className="border-b border-silver bg-ice-blue px-6 py-8 text-center sm:px-8 lg:border-b-0 lg:border-r lg:text-left">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="ds-overline text-navy">Repository Score</p>
                  <ScoreCircle
                    className="mx-auto lg:mx-0"
                    size="lg"
                    value={87}
                  />
                  <p className="ds-body-secondary mx-auto max-w-sm lg:mx-0">
                    vercel/next.js would surface as a high-signal repository with
                    strong impact and consistently solid execution.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {previewMetrics.map((metric) => (
                    <div
                      className="rounded-md border border-silver bg-white px-4 py-4"
                      key={metric.label}
                    >
                      <p className="text-sm font-medium text-dark-slate">{metric.label}</p>
                      <p className="mt-2 text-3xl font-semibold tabular-nums text-navy">
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <div className="px-6 py-8 sm:px-8">
              <div className="flex flex-col gap-4 border-b border-silver pb-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="space-y-2">
                  <p className="ds-overline text-navy">Pull Request Breakdown</p>
                  <h3 className="ds-heading-4">
                    Recent Merged Pull Requests Ranked by Composite Score
                  </h3>
                </div>
                <span className="rounded-full border border-silver bg-lavender-mist px-4 py-2 text-sm font-medium text-navy">
                  Sample: 24 merged PRs
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {previewPullRequests.map((pullRequest) => (
                  <article
                    className="rounded-md border border-silver bg-white px-4 py-4"
                    key={pullRequest.id}
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1 space-y-2">
                        <p className="text-sm font-medium text-cool-gray">
                          {pullRequest.id} · {pullRequest.delta}
                        </p>
                        <h4 className="text-base font-semibold leading-6 text-navy sm:text-lg">
                          {pullRequest.title}
                        </h4>
                        <p className="text-sm leading-6 text-dark-slate">
                          {pullRequest.dimension}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 sm:pl-6">
                        <span className="rounded-full border border-silver bg-ice-blue px-3 py-2 text-sm font-medium text-dark-slate">
                          Score
                        </span>
                        <span className="text-2xl font-semibold tabular-nums text-navy">
                          {pullRequest.score}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
