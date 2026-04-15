import type { PullRequestScoringSource } from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/repository-contracts";
import {
  scoringPromptFileLimit,
  scoringPromptPatchCharacterLimit,
} from "@/features/pr-analysis/lib/pr-analysis-config";

const formatPullRequestFiles = (pullRequest: PullRequestScoringSource) =>
  pullRequest.files
    .slice(0, scoringPromptFileLimit)
    .map((file, index) => {
      const patchPreview =
        file.patch === null
          ? "No patch provided by GitHub."
          : file.patch.slice(0, scoringPromptPatchCharacterLimit);

      return [
        `File ${index + 1}: ${file.filename}`,
        `Status: ${file.status}`,
        `Additions: ${file.additions}`,
        `Deletions: ${file.deletions}`,
        "Patch:",
        patchPreview,
      ].join("\n");
    })
    .join("\n\n");

export const buildPullRequestScoringPrompt = (
  pullRequest: PullRequestScoringSource,
  repository: NormalizedRepository,
) =>
  [
    "You are scoring one merged GitHub pull request.",
    "Return only the JSON object required by the response schema.",
    "Score each dimension from 0 to 100.",
    "Treat aiLeverage as an evidence-based estimate, not a certainty claim.",
    "Use short, concrete rationales tied to the PR details and diff evidence.",
    "",
    `Repository: ${repository.fullName}`,
    `Pull request number: ${pullRequest.number}`,
    `Title: ${pullRequest.title}`,
    `Author: ${pullRequest.authorLogin ?? "unknown"}`,
    `Merged at: ${pullRequest.mergedAt}`,
    `Additions: ${pullRequest.additions}`,
    `Deletions: ${pullRequest.deletions}`,
    `Changed files: ${pullRequest.changedFiles}`,
    "",
    "Pull request body:",
    pullRequest.body || "No description provided.",
    "",
    "Changed files and diff excerpts:",
    formatPullRequestFiles(pullRequest) || "No file details provided.",
  ].join("\n");
