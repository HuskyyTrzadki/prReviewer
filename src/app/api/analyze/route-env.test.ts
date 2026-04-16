import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { prepareRepositoryAnalysisSource } from "@/features/pr-analysis/lib/prepare-repository-analysis-source";
import { missingGoogleApiKeyMessage } from "@/features/pr-analysis/lib/gemini-client";

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

  it("throws before GitHub work when GOOGLE_API_KEY is missing", async () => {
    await expect(
      POST(
        createJsonRequest(
          JSON.stringify({ repositoryUrl: "https://github.com/vercel/next.js" }),
        ),
      ),
    ).rejects.toThrow(missingGoogleApiKeyMessage);

    expect(prepareRepositoryAnalysisSourceMock).not.toHaveBeenCalled();
  });
});
