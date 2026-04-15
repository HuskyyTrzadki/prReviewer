import { describe, expect, it } from "vitest";

import { repositoryAnalysisSourceSchema } from "@/features/pr-analysis/contracts/analysis-source";

describe("analysis source contracts", () => {
  it("accepts normalized repository analysis source data", () => {
    const payload = {
      repository: {
        owner: "vercel",
        repo: "next.js",
        fullName: "vercel/next.js",
        canonicalUrl: "https://github.com/vercel/next.js",
        defaultBranch: "canary",
      },
      pullRequests: [
        {
          number: 1,
          title: "Improve caching",
          body: "Adds better cache invalidation.",
          authorLogin: "leerob",
          htmlUrl: "https://github.com/vercel/next.js/pull/1",
          mergedAt: "2026-04-14T19:00:00.000Z",
          additions: 42,
          deletions: 9,
          changedFiles: 3,
        },
      ],
      requestedPullRequestLimit: 20,
    };

    expect(repositoryAnalysisSourceSchema.parse(payload)).toEqual(payload);
  });
});
