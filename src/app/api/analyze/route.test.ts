import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { analyzeRepositoryResponseSchema } from "@/features/pr-analysis/contracts/analysis-contracts";
import type { prepareRepositoryAnalysisSource } from "@/features/pr-analysis/lib/prepare-repository-analysis-source";
import type { prepareRepositoryScoringSource } from "@/features/pr-analysis/lib/prepare-repository-scoring-source";
import type { runRepositoryScoring } from "@/features/pr-analysis/lib/run-repository-scoring";
import {
  analysisFailedMessage,
  githubRateLimitedMessage,
  invalidAnalyzeRequestBodyMessage,
  noMergedPullRequestsMessage,
  repositoryNotFoundOrPrivateMessage,
} from "@/features/pr-analysis/lib/analysis-api-errors";

const {
  prepareRepositoryAnalysisSourceMock,
  prepareRepositoryScoringSourceMock,
  runRepositoryScoringMock,
} = vi.hoisted(() => ({
  prepareRepositoryAnalysisSourceMock: vi.fn<typeof prepareRepositoryAnalysisSource>(),
  prepareRepositoryScoringSourceMock: vi.fn<typeof prepareRepositoryScoringSource>(),
  runRepositoryScoringMock: vi.fn<typeof runRepositoryScoring>(),
}));

vi.mock("@/features/pr-analysis/lib/prepare-repository-analysis-source", () => ({
  prepareRepositoryAnalysisSource: prepareRepositoryAnalysisSourceMock,
}));

vi.mock("@/features/pr-analysis/lib/prepare-repository-scoring-source", () => ({
  prepareRepositoryScoringSource: prepareRepositoryScoringSourceMock,
}));

vi.mock("@/features/pr-analysis/lib/run-repository-scoring", () => ({
  runRepositoryScoring: runRepositoryScoringMock,
}));

import { POST } from "./route";

const createJsonRequest = (body: BodyInit) =>
  new NextRequest("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
  });

describe("POST /api/analyze", () => {
  beforeEach(() => {
    prepareRepositoryAnalysisSourceMock.mockReset();
    prepareRepositoryScoringSourceMock.mockReset();
    runRepositoryScoringMock.mockReset();
  });

  it("returns a typed error for invalid JSON", async () => {
    const response = await POST(createJsonRequest("{"));
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      status: "error",
      code: "INVALID_REQUEST_BODY",
      message: invalidAnalyzeRequestBodyMessage,
    });
  });

  it("returns a typed error for an invalid request body", async () => {
    const response = await POST(createJsonRequest(JSON.stringify({ foo: "bar" })));
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      status: "error",
      code: "INVALID_REQUEST_BODY",
      message: invalidAnalyzeRequestBodyMessage,
    });
  });

  it("returns a typed error for an unsupported repository URL", async () => {
    const response = await POST(
      createJsonRequest(
        JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js/pull/123" }),
      ),
    );
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      status: "error",
      code: "UNSUPPORTED_REPOSITORY_RESOURCE",
      message: "Use a repository root URL like https://github.com/owner/repository.",
    });
  });

  it("returns a typed success payload for a valid repository URL", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: true,
      value: {
        repository: {
          owner: "vercel",
          repo: "next.js",
          fullName: "vercel/next.js",
          canonicalUrl: "https://github.com/vercel/next.js",
          defaultBranch: "canary",
        },
        pullRequests: [],
        requestedPullRequestLimit: 20,
      },
    });
    prepareRepositoryScoringSourceMock.mockResolvedValue({
      ok: true,
      value: {
        repository: {
          owner: "vercel",
          repo: "next.js",
          fullName: "vercel/next.js",
          canonicalUrl: "https://github.com/vercel/next.js",
          defaultBranch: "canary",
        },
        pullRequests: [],
        requestedPullRequestLimit: 8,
      },
    });
    runRepositoryScoringMock.mockResolvedValue({
      ok: true,
      value: {
        repository: {
          owner: "vercel",
          repo: "next.js",
          fullName: "vercel/next.js",
          canonicalUrl: "https://github.com/vercel/next.js",
        },
        summary: {
          impactScore: 80,
          aiLeverageScore: 58,
          qualityScore: 85,
          overallScore: 74,
          scoredPullRequestCount: 1,
          skippedPullRequestCount: 0,
        },
        pullRequests: [
          {
            number: 11,
            title: "Improve cache hints",
            body: "Refines cache usage.",
            authorLogin: "leerob",
            htmlUrl: "https://github.com/vercel/next.js/pull/11",
            mergedAt: "2026-04-14T19:00:00.000Z",
            additions: 10,
            deletions: 2,
            changedFiles: 1,
            summary: "Temporary local score.",
            impactScore: 80,
            impactRationale: "Temporary local estimate.",
            aiLeverageScore: 58,
            aiLeverageRationale: "Temporary local estimate.",
            qualityScore: 85,
            qualityRationale: "Temporary local estimate.",
            overallScore: 74,
          },
        ],
        skippedPullRequests: [],
      },
    });

    const response = await POST(
      createJsonRequest(
        JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js" }),
      ),
    );
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(200);
    expect(payload.status).toBe("success");

    if (payload.status !== "success") {
      throw new Error("Expected success payload.");
    }

    expect(payload.repository).toEqual({
      owner: "vercel",
      repo: "next.js",
      fullName: "vercel/next.js",
      canonicalUrl: "https://github.com/vercel/next.js",
    });
    expect(payload.repoId).toMatch(/\S+/);
    expect(payload.redirectUrl).toBe(`/results/${payload.repoId}`);
    expect(payload.analysis).toEqual({
      summary: {
        impactScore: 80,
        aiLeverageScore: 58,
        qualityScore: 85,
        overallScore: 74,
        scoredPullRequestCount: 1,
        skippedPullRequestCount: 0,
      },
      pullRequests: [
        {
          number: 11,
          title: "Improve cache hints",
          body: "Refines cache usage.",
          authorLogin: "leerob",
          htmlUrl: "https://github.com/vercel/next.js/pull/11",
          mergedAt: "2026-04-14T19:00:00.000Z",
          additions: 10,
          deletions: 2,
          changedFiles: 1,
          summary: "Temporary local score.",
          impactScore: 80,
          impactRationale: "Temporary local estimate.",
          aiLeverageScore: 58,
          aiLeverageRationale: "Temporary local estimate.",
          qualityScore: 85,
          qualityRationale: "Temporary local estimate.",
          overallScore: 74,
        },
      ],
      skippedPullRequests: [],
    });
  });

  it("returns a typed 404 when the repository is missing or private", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: false,
      error: {
        code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
        message: repositoryNotFoundOrPrivateMessage,
      },
    });

    const response = await POST(
      createJsonRequest(
        JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js" }),
      ),
    );
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(404);
    expect(payload).toEqual({
      status: "error",
      code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
      message: repositoryNotFoundOrPrivateMessage,
    });
  });

  it("returns a typed 429 when github rate limits the analysis", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: false,
      error: {
        code: "GITHUB_RATE_LIMITED",
        message: githubRateLimitedMessage,
      },
    });

    const response = await POST(
      createJsonRequest(
        JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js" }),
      ),
    );
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(429);
    expect(payload).toEqual({
      status: "error",
      code: "GITHUB_RATE_LIMITED",
      message: githubRateLimitedMessage,
    });
  });

  it("returns a typed 422 when no merged pull requests are available", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: false,
      error: {
        code: "NO_MERGED_PULL_REQUESTS",
        message: noMergedPullRequestsMessage,
      },
    });

    const response = await POST(
      createJsonRequest(
        JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js" }),
      ),
    );
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(422);
    expect(payload).toEqual({
      status: "error",
      code: "NO_MERGED_PULL_REQUESTS",
      message: noMergedPullRequestsMessage,
    });
  });

  it("returns a typed 502 when scoring cannot produce any scored pull requests", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: true,
      value: {
        repository: {
          owner: "vercel",
          repo: "next.js",
          fullName: "vercel/next.js",
          canonicalUrl: "https://github.com/vercel/next.js",
          defaultBranch: "canary",
        },
        pullRequests: [],
        requestedPullRequestLimit: 20,
      },
    });
    prepareRepositoryScoringSourceMock.mockResolvedValue({
      ok: true,
      value: {
        repository: {
          owner: "vercel",
          repo: "next.js",
          fullName: "vercel/next.js",
          canonicalUrl: "https://github.com/vercel/next.js",
          defaultBranch: "canary",
        },
        pullRequests: [],
        requestedPullRequestLimit: 8,
      },
    });
    runRepositoryScoringMock.mockResolvedValue({
      ok: false,
      error: {
        code: "ANALYSIS_FAILED",
        message: analysisFailedMessage,
      },
    });

    const response = await POST(
      createJsonRequest(
        JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js" }),
      ),
    );
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(502);
    expect(payload).toEqual({
      status: "error",
      code: "ANALYSIS_FAILED",
      message: analysisFailedMessage,
    });
  });
});
