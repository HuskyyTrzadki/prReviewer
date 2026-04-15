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
import { scorePullRequestsWithGemini } from "@/features/pr-analysis/lib/score-pull-request-with-gemini";

describe("scorePullRequestsWithGemini", () => {
  beforeEach(() => {
    process.env.GOOGLE_API_KEY = "test-key";
    generateContentMock.mockReset();
  });

  it("requests schema-enforced JSON from Gemini for one pull request batch", async () => {
    generateContentMock.mockResolvedValue({
      text: JSON.stringify({
        pullRequests: [
          {
            number: 42,
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
          },
          {
            number: 43,
            summary: "Useful follow-up with broader code motion.",
            impact: {
              score: 68,
              rationale: "Improves behavior in a broader module.",
            },
            aiLeverage: {
              score: 54,
              rationale: "There are some AI-assisted drafting signals.",
            },
            quality: {
              score: 77,
              rationale: "The work remains cohesive.",
            },
          },
        ],
      }),
    });

    const result = await scorePullRequestsWithGemini(
      [createPullRequestScoringSource(42), createPullRequestScoringSource(43)],
      testRepository,
    );

    expect(result).toEqual({
      pullRequests: [
        {
          number: 42,
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
        },
        {
          number: 43,
          summary: "Useful follow-up with broader code motion.",
          impact: {
            score: 68,
            rationale: "Improves behavior in a broader module.",
          },
          aiLeverage: {
            score: 54,
            rationale: "There are some AI-assisted drafting signals.",
          },
          quality: {
            score: 77,
            rationale: "The work remains cohesive.",
          },
        },
      ],
    });
    expect(generateContentMock).toHaveBeenCalledTimes(1);
    expect(generateContentMock).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-3-flash-preview",
        config: expect.objectContaining({
          responseMimeType: "application/json",
          responseJsonSchema: expect.objectContaining({
            type: "object",
            required: ["pullRequests"],
            additionalProperties: false,
          }),
        }),
      }),
    );
  });

  it("returns raw text when Gemini still responds with invalid JSON", async () => {
    generateContentMock.mockResolvedValue({
      text: 'Of course. Here is the JSON: {"pullRequests":[]}',
    });

    const result = await scorePullRequestsWithGemini(
      [createPullRequestScoringSource(7)],
      testRepository,
    );

    expect(result).toBe('Of course. Here is the JSON: {"pullRequests":[]}');
  });

  it("throws when GOOGLE_API_KEY is missing", async () => {
    delete process.env.GOOGLE_API_KEY;

    await expect(
      scorePullRequestsWithGemini([createPullRequestScoringSource(3)], testRepository),
    ).rejects.toThrow(missingGoogleApiKeyMessage);
  });
});
