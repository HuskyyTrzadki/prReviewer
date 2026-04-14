import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { analyzeRepositoryResponseSchema } from "@/features/pr-analysis/contracts/analysis-contracts";

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
});
