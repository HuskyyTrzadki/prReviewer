import { getAnalysisLoadingSnapshot } from "@/features/repo-input/analysis-loading-content";

type AnalysisLoadingPanelProps = {
  tick: number;
};

export const AnalysisLoadingPanel = ({
  tick,
}: AnalysisLoadingPanelProps) => {
  const { currentPhase, insight, phases } = getAnalysisLoadingSnapshot(tick);
  const highlightedInsight = insight.split("? ");
  const insightLead =
    highlightedInsight.length > 1 ? `${highlightedInsight[0]}?` : "Review note";
  const insightBody =
    highlightedInsight.length > 1
      ? highlightedInsight.slice(1).join("? ")
      : insight;

  return (
    <div
      aria-live="polite"
      className="mt-4 rounded-md border border-silver bg-ice-blue p-4 sm:p-5"
      role="status"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="ds-overline text-navy">Analysis in Progress</p>
            <h3 className="text-lg font-semibold text-navy sm:text-xl">
              {currentPhase.title}
            </h3>
            <p className="ds-body-secondary">{currentPhase.description}</p>
          </div>

          <div className="space-y-3">
            {phases.map((phase, index) => {
              const isCurrent = index === Math.min(tick, phases.length - 1);
              const isComplete = index < Math.min(tick, phases.length - 1);

              return (
                <div
                  className="flex items-center gap-3"
                  key={phase.title}
                >
                  <span
                    aria-hidden="true"
                    className={`size-3 rounded-full ${
                      isComplete || isCurrent
                        ? "bg-indigo-violet"
                        : "bg-white"
                    } border border-silver`}
                  />
                  <span
                    className={`text-sm sm:text-base ${
                      isCurrent
                        ? "font-medium text-navy"
                        : "text-dark-slate"
                    }`}
                  >
                    {phase.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-md border border-silver bg-white p-4 sm:p-5">
          <div className="flex items-start gap-4">
            <span
              aria-hidden="true"
              className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-soft-indigo text-lg text-indigo-violet"
            >
              ✦
            </span>

            <div className="min-w-0 space-y-3">
              <div className="space-y-1">
                <p className="ds-overline text-navy">While You Wait</p>
                <h4 className="text-base font-semibold text-navy sm:text-lg">
                  {insightLead}
                </h4>
              </div>

              <p className="rounded-xl bg-ice-blue px-4 py-3 text-sm leading-6 text-dark-slate sm:text-base">
                {insightBody}
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
