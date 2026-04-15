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

const formatPullRequestSection = (pullRequest: PullRequestScoringSource) =>
  [
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

export const buildPullRequestScoringPrompt = (
  pullRequests: PullRequestScoringSource[],
  repository: NormalizedRepository,
) =>
  [
    "You are scoring merged GitHub pull requests.",
    "Return only the JSON object required by the response schema.",
    "Return one result for each pull request number provided.",
    "Each item must include the matching pull request number.",
    "Score each dimension from 0 to 100.",
    "Treat aiLeverage as an evidence-based estimate, not a certainty claim.",
    "Use short, concrete rationales tied to the PR details and diff evidence.",
    "",
    `Repository: ${repository.fullName}`,
    `Batch size: ${pullRequests.length}`,
    "",
    ...pullRequests.flatMap((pullRequest, index) => [
      `PR ${index + 1}`,
      formatPullRequestSection(pullRequest),
      "",
    ]),
  ].join("\n");
