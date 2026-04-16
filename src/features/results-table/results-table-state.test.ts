import { describe, expect, it } from "vitest";

import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";
import {
  createResultsTableQueryString,
  defaultResultsTableState,
  filterAndSortPullRequests,
  formatPullRequestMergedDate,
  getResultsTableAuthorOptions,
  parseResultsTableState,
  unknownAuthorFilterValue,
} from "@/features/results-table/results-table-state";

const createScoredPullRequest = (
  number: number,
  overrides: Partial<ScoredPullRequest> = {},
): ScoredPullRequest => ({
  number,
  title: `PR ${number}`,
  body: `Body ${number}`,
  authorLogin: `author-${number}`,
  htmlUrl: `https://github.com/vercel/next.js/pull/${number}`,
  mergedAt: `2026-04-${String(number).padStart(2, "0")}T12:00:00.000Z`,
  additions: number * 10,
  deletions: number * 4,
  changedFiles: number,
  summary: `Summary ${number}`,
  impactScore: 40 + number,
  impactRationale: "Impact rationale",
  aiLeverageScore: 30 + number,
  aiLeverageRationale: "AI rationale",
  qualityScore: 60 + number,
  qualityRationale: "Quality rationale",
  overallScore: 50 + number,
  ...overrides,
});

const pullRequests = [
  createScoredPullRequest(1, {
    title: "Fix docs alignment",
    authorLogin: "alice",
    additions: 8,
    deletions: 4,
    impactScore: 42,
    aiLeverageScore: 38,
    qualityScore: 66,
    overallScore: 49,
  }),
  createScoredPullRequest(2, {
    title: "Refactor routing cache",
    authorLogin: "bob",
    additions: 40,
    deletions: 20,
    impactScore: 81,
    aiLeverageScore: 55,
    qualityScore: 88,
    overallScore: 75,
  }),
  createScoredPullRequest(3, {
    title: "Add AI summary cards",
    authorLogin: null,
    additions: 180,
    deletions: 60,
    impactScore: 73,
    aiLeverageScore: 91,
    qualityScore: 84,
    overallScore: 85,
    summary: "AI-forward repository summary view",
  }),
];

describe("resultsTableState", () => {
  it("uses the default results state when no query params are set", () => {
    expect(parseResultsTableState(new URLSearchParams())).toEqual(
      defaultResultsTableState,
    );
  });

  it("round-trips explicit query params", () => {
    const queryString = createResultsTableQueryString({
      ...defaultResultsTableState,
      q: "cache",
      author: "bob",
      size: "sm",
      impactMin: 70,
      aiMin: 50,
      qualityMin: 70,
      overallMin: 70,
      sort: "quality",
      dir: "asc",
    });

    expect(parseResultsTableState(new URLSearchParams(queryString))).toEqual({
      q: "cache",
      author: "bob",
      size: "sm",
      impactMin: 70,
      aiMin: 50,
      qualityMin: 70,
      overallMin: 70,
      sort: "quality",
      dir: "asc",
    });
  });

  it("filters by author, size bucket, search term, and minimum scores", () => {
    const filteredPullRequests = filterAndSortPullRequests(pullRequests, {
      ...defaultResultsTableState,
      q: "summary",
      author: unknownAuthorFilterValue,
      size: "lg",
      aiMin: 85,
      overallMin: 85,
    });

    expect(filteredPullRequests.map((pullRequest) => pullRequest.number)).toEqual([
      3,
    ]);
  });

  it("sorts by the chosen field and direction", () => {
    const sortedByAuthor = filterAndSortPullRequests(pullRequests, {
      ...defaultResultsTableState,
      sort: "author",
      dir: "asc",
    });
    const sortedByOverall = filterAndSortPullRequests(pullRequests, {
      ...defaultResultsTableState,
      sort: "overall",
      dir: "desc",
    });

    expect(sortedByAuthor.map((pullRequest) => pullRequest.number)).toEqual([
      3, 1, 2,
    ]);
    expect(sortedByOverall.map((pullRequest) => pullRequest.number)).toEqual([
      3, 2, 1,
    ]);
  });

  it("builds distinct author options including unknown authors", () => {
    expect(getResultsTableAuthorOptions(pullRequests)).toEqual([
      { value: "alice", label: "alice" },
      { value: "bob", label: "bob" },
      { value: unknownAuthorFilterValue, label: "Unknown author" },
    ]);
  });

  it("formats merged dates with Intl", () => {
    expect(formatPullRequestMergedDate("2026-04-15T12:00:00.000Z")).toBe(
      "Apr 15, 2026",
    );
  });
});
