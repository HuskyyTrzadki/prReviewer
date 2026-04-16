const analysisLoadingPhases = [
  {
    title: "Checking repository access",
    description:
      "First we validate the GitHub repository and confirm it is public enough to analyze.",
  },
  {
    title: "Loading merged pull requests",
    description:
      "Recent merged pull requests are loaded so the review stays grounded in shipped work.",
  },
  {
    title: "Preparing review context",
    description:
      "Each pull request is reduced into lightweight evidence so the score has something concrete to read.",
  },
  {
    title: "Reviewing pull requests with Gemini",
    description:
      "Every sampled pull request is scored against the same structured rubric for impact, AI leverage, and quality.",
  },
  {
    title: "Assembling the repository score",
    description:
      "Pull-request scores are rolled up into one repository view so the final read stays explainable.",
  },
] as const;

const analysisLoadingInsights = [
  "Did you know? Focused pull requests are easier to score consistently than broad cleanup batches.",
  "AI leverage is treated as an evidence-based estimate, not a hard detector.",
  "Quality scores favor changes with a clear goal, cleaner descriptions, and less accidental sprawl.",
  "Repository score is an aggregate view. The pull requests underneath still matter more than the headline number.",
  "Merged pull requests are used because they show reviewed, integrated work instead of abandoned branches.",
  "Smaller diffs with strong intent can score higher than large but noisy pull requests.",
  "Engineering quality is not just syntax. Structure, intent, and maintainability all matter here.",
  "The analysis keeps the rubric narrow on purpose so the score remains legible to real reviewers.",
  "Skipped pull requests do not invalidate the whole run unless every score attempt fails.",
  "This step is doing real repository reads, not a local demo animation.",
] as const;

const getCurrentPhase = (tick: number) =>
  analysisLoadingPhases[Math.min(tick, analysisLoadingPhases.length - 1)];

export const getAnalysisLoadingSnapshot = (tick: number) => {
  const insightIndex = tick % analysisLoadingInsights.length;

  return {
    currentPhase: getCurrentPhase(tick),
    insight: analysisLoadingInsights[insightIndex],
    phases: analysisLoadingPhases,
  };
};

export { analysisLoadingInsights, analysisLoadingPhases };
