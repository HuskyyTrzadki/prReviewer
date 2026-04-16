import { describe, expect, it } from "vitest";

import {
  analysisLoadingPhases,
  getAnalysisLoadingSnapshot,
} from "@/features/repo-input/model/analysis-loading-content";

describe("getAnalysisLoadingSnapshot", () => {
  it("starts with the first real analysis phase", () => {
    expect(getAnalysisLoadingSnapshot(0).currentPhase).toEqual(
      analysisLoadingPhases[0],
    );
  });

  it("pins the current phase to the last known phase once the tick is higher", () => {
    expect(getAnalysisLoadingSnapshot(999).currentPhase).toEqual(
      analysisLoadingPhases[analysisLoadingPhases.length - 1],
    );
  });

  it("rotates insight copy deterministically", () => {
    const firstInsight = getAnalysisLoadingSnapshot(0).insight;
    const repeatedInsight = getAnalysisLoadingSnapshot(10).insight;

    expect(firstInsight).toBe(repeatedInsight);
  });
});
