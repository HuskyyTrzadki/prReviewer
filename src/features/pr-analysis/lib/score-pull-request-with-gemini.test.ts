import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createPullRequestScoringSource,
  testRepository,
} from "@/features/pr-analysis/lib/pr-analysis.test-helpers";

const { generateContentMock } = vi.hoisted(() => ({
  generateContentMock: vi.fn(),
}));

vi.mock("@google/genai", () => ({
  GoogleGenAI: class {
    models = {
      generateContent: generateContentMock,
    };
  },
}));

import { missingGoogleApiKeyMessage } from "@/features/pr-analysis/lib/gemini-client";
import { scorePullRequestWithGemini } from "@/features/pr-analysis/lib/score-pull-request-with-gemini";

describe("scorePullRequestWithGemini", () => {
  beforeEach(() => {
    process.env.GOOGLE_API_KEY = "test-key";
    generateContentMock.mockReset();
  });

  it("requests schema-enforced JSON from Gemini", async () => {
    generateContentMock.mockResolvedValue({
      text: JSON.stringify({
        summary: "Strong fix with contained scope.",
        impact: {
          score: 74,
          rationale: "Touches a meaningful runtime path.",
        },
        aiLeverage: {
          score: 32,
          rationale: "Little direct AI evidence appears in the PR.",
        },
        quality: {
          score: 81,
          rationale: "The implementation is focused and coherent.",
        },
      }),
    });

    const result = await scorePullRequestWithGemini(
      createPullRequestScoringSource(42),
      testRepository,
    );

    expect(result).toEqual({
      summary: "Strong fix with contained scope.",
      impact: {
        score: 74,
        rationale: "Touches a meaningful runtime path.",
      },
      aiLeverage: {
        score: 32,
        rationale: "Little direct AI evidence appears in the PR.",
      },
      quality: {
        score: 81,
        rationale: "The implementation is focused and coherent.",
      },
    });
    expect(generateContentMock).toHaveBeenCalledTimes(1);
    expect(generateContentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-3-flash-preview",
        config: expect.objectContaining({
          responseMimeType: "application/json",
          responseJsonSchema: expect.objectContaining({
            type: "object",
            required: ["summary", "impact", "aiLeverage", "quality"],
            additionalProperties: false,
          }),
        }),
      }),
    );
  });

  it("returns raw text when Gemini still responds with invalid JSON", async () => {
    generateContentMock.mockResolvedValue({
      text: 'Of course. Here is the JSON: {"summary":"bad"}',
    });

    const result = await scorePullRequestWithGemini(
      createPullRequestScoringSource(7),
      testRepository,
    );

    expect(result).toBe('Of course. Here is the JSON: {"summary":"bad"}');
  });

  it("throws when GOOGLE_API_KEY is missing", async () => {
    delete process.env.GOOGLE_API_KEY;

    await expect(
      scorePullRequestWithGemini(createPullRequestScoringSource(3), testRepository),
    ).rejects.toThrow(missingGoogleApiKeyMessage);
  });
});
