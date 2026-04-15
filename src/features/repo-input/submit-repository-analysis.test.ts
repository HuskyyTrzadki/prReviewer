import { describe, expect, it, vi } from "vitest";

import {
  invalidAnalyzeRepositoryResponseMessage,
  submitRepositoryAnalysis,
} from "@/features/repo-input/submit-repository-analysis";

describe("submitRepositoryAnalysis", () => {
  it("returns a typed success payload from the analyze route", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "success",
          repository: {
            owner: "vercel",
            repo: "next.js",
            fullName: "vercel/next.js",
            canonicalUrl: "https://github.com/vercel/next.js",
          },
          repoId: "repo_demo",
          redirectUrl: "/results/repo_demo",
          analysis: {
            summary: {
              impactScore: 80,
              aiLeverageScore: 58,
              qualityScore: 85,
              overallScore: 74,
              scoredPullRequestCount: 1,
              skippedPullRequestCount: 0,
            },
            pullRequests: [],
            skippedPullRequests: [],
          },
        }),
      ),
    );

    const response = await submitRepositoryAnalysis(
      "https://github.com/vercel/next.js",
      fetchMock,
    );

    expect(fetchMock).toHaveBeenCalledWith("/api/analyze", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        repositoryUrl: "https://github.com/vercel/next.js",
      }),
    });
    expect(response).toEqual({
      status: "success",
      repository: {
        owner: "vercel",
        repo: "next.js",
        fullName: "vercel/next.js",
        canonicalUrl: "https://github.com/vercel/next.js",
      },
      repoId: "repo_demo",
      redirectUrl: "/results/repo_demo",
      analysis: {
        summary: {
          impactScore: 80,
          aiLeverageScore: 58,
          qualityScore: 85,
          overallScore: 74,
          scoredPullRequestCount: 1,
          skippedPullRequestCount: 0,
        },
        pullRequests: [],
        skippedPullRequests: [],
      },
    });
  });

  it("returns a typed error payload from the analyze route", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "error",
          code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
          message:
            "This repository was not found or is private. Use a public GitHub repository URL.",
        }),
        { status: 404 },
      ),
    );

    const response = await submitRepositoryAnalysis(
      "https://github.com/vercel/next.js",
      fetchMock,
    );

    expect(response).toEqual({
      status: "error",
      code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
      message:
        "This repository was not found or is private. Use a public GitHub repository URL.",
    });
  });

  it("throws when the analyze route returns a malformed payload", async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ ok: true })),
    );

    await expect(
      submitRepositoryAnalysis("https://github.com/vercel/next.js", fetchMock),
    ).rejects.toThrow(invalidAnalyzeRepositoryResponseMessage);
  });
});
