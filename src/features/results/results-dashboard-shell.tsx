"use client";

import { useSyncExternalStore } from "react";

import {
  readAnalysisResult,
  type StoredAnalysisResult,
} from "@/features/results/results-session";
import { ResultsDashboardSuccess } from "@/features/results/results-dashboard-success";
import { ResultsStatePanel } from "@/features/results/results-state-panel";

type ResultsDashboardShellProps = {
  repoId: string;
};

type ResultsDashboardViewState =
  | {
      status: "loading";
    }
  | StoredAnalysisResult;

const loadingViewState: ResultsDashboardViewState = {
  status: "loading",
};

const subscribeToStoredAnalysisResult = () => () => {};

const LoadingState = () => (
  <section className="ds-section bg-ice-blue">
    <div className="ds-container">
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          {[0, 1].map((item) => (
            <div
              className="h-72 animate-pulse rounded-md border border-silver bg-white"
              key={item}
            />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-md border border-silver bg-white" />
      </div>
    </div>
  </section>
);

export const ResultsDashboardShell = ({
  repoId,
}: ResultsDashboardShellProps) => {
  const viewState = useSyncExternalStore<ResultsDashboardViewState>(
    subscribeToStoredAnalysisResult,
    () => readAnalysisResult(repoId),
    () => loadingViewState,
  );

  if (viewState.status === "loading") {
    return <LoadingState />;
  }

  if (viewState.status === "empty") {
    return (
      <ResultsStatePanel
        actionHref="/"
        actionLabel="Analyze another repository"
        description="This temporary dashboard view only has access to results created in the current browser tab. Run a fresh analysis from the landing page to open the repository score here."
        eyebrow="No Stored Result"
        title="There is no analysis result available for this link yet."
      />
    );
  }

  if (viewState.status === "error") {
    return (
      <ResultsStatePanel
        actionHref="/"
        actionLabel="Back to the landing page"
        description="The stored analysis payload for this repository could not be read safely, so the dashboard stayed closed instead of rendering bad data."
        eyebrow="Result Unavailable"
        title="This analysis result could not be restored in the browser."
      />
    );
  }

  return <ResultsDashboardSuccess result={viewState.data} />;
};
