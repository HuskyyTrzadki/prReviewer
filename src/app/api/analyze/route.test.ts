import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { analyzeRepositoryResponseSchema } from "@/features/pr-analysis/contracts/analysis-contracts";

const { prepareRepositoryAnalysisSourceMock } = vi.hoisted(() => ({
  prepareRepositoryAnalysisSourceMock: vi.fn(),
}));

vi.mock("@/features/pr-analysis/lib/prepare-repository-analysis-source", () => ({
  prepareRepositoryAnalysisSource: prepareRepositoryAnalysisSourceMock,
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
  });

  it("returns a typed error for invalid JSON", async () => {
    const response = await POST(createJsonRequest("{"));
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      status: "error",
      code: "INVALID_REQUEST_BODY",
      message: "Request body must be valid JSON with a repositoryUrl field.",
    });
  });

  it("returns a typed error for an invalid request body", async () => {
    const response = await POST(createJsonRequest(JSON.stringify({ foo: "bar" })));
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      status: "error",
      code: "INVALID_REQUEST_BODY",
      message: "Request body must be valid JSON with a repositoryUrl field.",
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
  });

  it("returns a typed 404 when the repository is missing or private", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: false,
      error: {
        code: "REPOSITORY_NOT_FOUND_OR_PRIVATE",
        message:
          "This repository was not found or is private. Use a public GitHub repository URL.",
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
      message:
        "This repository was not found or is private. Use a public GitHub repository URL.",
    });
  });

  it("returns a typed 429 when github rate limits the analysis", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: false,
      error: {
        code: "GITHUB_RATE_LIMITED",
        message: "GitHub rate limit was reached. Try again later.",
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
      message: "GitHub rate limit was reached. Try again later.",
    });
  });

  it("returns a typed 422 when no merged pull requests are available", async () => {
    prepareRepositoryAnalysisSourceMock.mockResolvedValue({
      ok: false,
      error: {
        code: "NO_MERGED_PULL_REQUESTS",
        message: "No merged pull requests were found for this repository.",
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
      message: "No merged pull requests were found for this repository.",
    });
  });
});
