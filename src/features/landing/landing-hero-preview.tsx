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
    <div className="relative mx-auto w-full max-w-[34rem] py-8 lg:mx-0 lg:py-6">
      <div
        aria-hidden="true"
        className="absolute -left-6 top-20 size-20 rounded-full bg-white/70 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-1 top-8 size-28 rounded-full bg-lavender-mist blur-3xl"
      />

      <div className="group/preview relative mx-auto max-w-[27rem]">
        <div
          aria-hidden="true"
          className="absolute left-4 top-7 h-full w-full rounded-[1.75rem] border border-silver/80 bg-white/60 shadow-soft transition-transform duration-300 group-hover/preview:translate-x-2 group-hover/preview:translate-y-1 group-focus-within/hero:translate-x-2 group-focus-within/hero:translate-y-1 motion-reduce:transition-none"
        />

        <article className="relative z-10 overflow-hidden rounded-[1.75rem] border border-silver bg-white p-5 shadow-float transition-transform duration-300 group-hover/preview:-translate-y-1 group-focus-within/hero:-translate-y-1 motion-reduce:transition-none sm:p-6">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-0 h-px bg-soft-indigo"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-6 left-[-35%] w-28 -skew-x-12 bg-white/80 opacity-0 blur-2xl transition-all duration-500 group-hover/preview:left-[110%] group-hover/preview:opacity-100 group-focus-within/hero:left-[110%] group-focus-within/hero:opacity-100 motion-reduce:hidden"
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

              <ResultsScoreCircle
                className="transition-transform duration-300 group-hover/preview:scale-[1.03] group-focus-within/hero:scale-[1.06] motion-reduce:transition-none"
                size="md"
                value={87}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {previewScores.map((score) => (
                <div
                  className="rounded-xl border border-silver bg-white px-4 py-3 transition-transform duration-300 group-hover/preview:-translate-y-0.5 group-focus-within/hero:-translate-y-0.5 motion-reduce:transition-none"
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
              {previewPullRequests.map((pullRequest, index) => (
                <div
                  className="rounded-xl border border-silver bg-ice-blue px-4 py-4 transition-transform duration-300 motion-reduce:transition-none"
                  key={pullRequest.title}
                  style={{
                    transform:
                      index === 0
                        ? undefined
                        : "translateX(0.35rem)",
                  }}
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
        <div className="absolute -right-8 -top-14 z-20 rounded-xl border border-silver bg-white px-4 py-3 shadow-soft rotate-[4deg] transition-transform duration-300 group-hover/preview:translate-y-1 group-focus-within/hero:translate-y-2 motion-reduce:transition-none">
          <p className="ds-overline text-navy">AI reviewed</p>
          <p className="mt-1 text-sm font-medium text-dark-slate transition-opacity duration-200 group-focus-within/hero:opacity-0">
            Fast first-pass signal
          </p>
          <p className="pointer-events-none absolute inset-x-4 top-[1.95rem] text-sm font-medium text-dark-slate opacity-0 transition-opacity duration-200 group-focus-within/hero:opacity-100">
            Reading merged PRs
          </p>
        </div>
      </div>
    </div>
  );
};
