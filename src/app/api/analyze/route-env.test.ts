import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { analyzeRepositoryResponseSchema } from "@/features/pr-analysis/contracts/analysis-contracts";
import type { prepareRepositoryAnalysisSource } from "@/features/pr-analysis/lib/prepare-repository-analysis-source";
import { configurationErrorMessage } from "@/features/pr-analysis/lib/analysis-api-errors";

const { prepareRepositoryAnalysisSourceMock } = vi.hoisted(() => ({
  prepareRepositoryAnalysisSourceMock: vi.fn<typeof prepareRepositoryAnalysisSource>(),
}));

vi.mock("@/features/pr-analysis/lib/prepare-repository-analysis-source", () => ({
  prepareRepositoryAnalysisSource: prepareRepositoryAnalysisSourceMock,
}));

import { POST } from "./route";

const createJsonRequest = (body: string) =>
  new NextRequest("http://localhost:3000/api/analyze", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
  });

describe("POST /api/analyze env guard", () => {
  beforeEach(() => {
    delete process.env.GOOGLE_API_KEY;
    prepareRepositoryAnalysisSourceMock.mockReset();
  });

  it("returns a typed 500 before GitHub work when GOOGLE_API_KEY is missing", async () => {
    const response = await POST(
      createJsonRequest(
        JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js" }),
      ),
    );
    const payload = analyzeRepositoryResponseSchema.parse(await response.json());

    expect(response.status).toBe(500);
    expect(payload).toEqual({
      status: "error",
      code: "CONFIGURATION_ERROR",
      message: configurationErrorMessage,
    });
    expect(prepareRepositoryAnalysisSourceMock).not.toHaveBeenCalled();
  });
});
