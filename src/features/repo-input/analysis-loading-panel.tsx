import { getAnalysisLoadingSnapshot } from "@/features/repo-input/analysis-loading-content";

type AnalysisLoadingPanelProps = {
  tick: number;
};

export const AnalysisLoadingPanel = ({
  tick,
}: AnalysisLoadingPanelProps) => {
  const { currentPhase, insight, phases } = getAnalysisLoadingSnapshot(tick);

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

        <div className="rounded-md border border-silver bg-white p-4">
          <p className="ds-overline text-navy">While You Wait</p>
          <p className="mt-3 text-sm leading-6 text-dark-slate sm:text-base">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
};
