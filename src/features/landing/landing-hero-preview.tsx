import { ResultsScoreCircle } from "@/features/results-dashboard/results-score-circle";

const previewPullRequests = [
  { label: "Impact", title: "Refactor caching boundaries", value: "91" },
  { label: "Quality", title: "Stabilize flaky smoke coverage", value: "84" },
];

const previewScores = [
  { label: "Impact", value: "87" },
  { label: "AI leverage", value: "82" },
  { label: "Quality", value: "90" },
];

export const LandingHeroPreview = () => {
  return (
      <div className="relative mx-auto w-full max-w-[32rem] py-10 lg:mx-0 lg:py-16">
        <div
            aria-hidden="true"
            className="absolute -left-4 top-24 size-16 rounded-full bg-white/70 blur-2xl"
        />
        <div
            aria-hidden="true"
            className="absolute -right-2 top-14 size-24 rounded-full bg-lavender-mist blur-3xl"
        />

        <div className="relative mx-auto max-w-[26rem]">
          <article className="relative z-10 overflow-hidden rounded-[1.75rem] border border-silver bg-white p-5 shadow-float rotate-[2deg] sm:p-6">
            <div
                aria-hidden="true"
                className="absolute inset-x-6 top-0 h-px bg-soft-indigo"
            />

            <div className="space-y-5">
              <div className="flex items-start justify-between gap-5">
                <div className="space-y-1">
                  <p className="ds-overline text-navy">Repository review snapshot</p>
                  <h2 className="text-xl font-semibold leading-7 text-navy">
                    vercel/next.js
                  </h2>
                  <p className="text-sm font-medium text-dark-slate">Repository Score</p>
                </div>

                <ResultsScoreCircle size="md" value={87} />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {previewScores.map((score) => (
                    <div
                        className="rounded-xl border border-silver bg-white px-4 py-3"
                        key={score.label}
                    >
                      <p className="text-sm font-medium text-dark-slate">{score.label}</p>
                      <p className="mt-2 text-2xl font-semibold tabular-nums text-navy">
                        {score.value}
                      </p>
                    </div>
                ))}
              </div>

              <div className="space-y-3">
                {previewPullRequests.map((pullRequest) => (
                    <div
                        className="rounded-xl border border-silver bg-ice-blue px-4 py-4"
                        key={pullRequest.title}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 space-y-1">
                          <p className="text-sm font-medium text-cool-gray">
                            {pullRequest.label}
                          </p>
                          <p className="text-sm font-semibold text-navy sm:text-base">
                            {pullRequest.title}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full bg-white px-3 py-2 text-sm font-semibold tabular-nums text-navy">
                      {pullRequest.value}
                    </span>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </article>

          <div className="absolute -right-8 -top-12 z-20 rounded-xl border border-silver bg-white px-4 py-3 shadow-soft rotate-[4deg]">
            <p className="ds-overline text-navy">AI reviewed</p>
            <p className="mt-1 text-sm font-medium text-dark-slate">
              Fast first-pass signal
            </p>
          </div>
        </div>
      </div>
  );
};
