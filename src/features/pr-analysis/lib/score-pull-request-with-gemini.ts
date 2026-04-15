import type { PullRequestScoringSource } from "@/features/pr-analysis/contracts/analysis-source";
import type { NormalizedRepository } from "@/features/pr-analysis/contracts/repository-contracts";
import { buildPullRequestScoringPrompt } from "@/features/pr-analysis/lib/build-pr-scoring-prompt";
import { createGeminiClient } from "@/features/pr-analysis/lib/gemini-client";
import { geminiPullRequestScoringModel } from "@/features/pr-analysis/lib/pr-analysis-config";

const llmScoreDimensionJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["score", "rationale"],
  properties: {
    score: {
      type: "number",
      minimum: 0,
      maximum: 100,
    },
    rationale: {
      type: "string",
    },
  },
} as const;

const llmPullRequestScoreJsonSchema = {
  type: "object",
  additionalProperties: false,
  propertyOrdering: ["summary", "impact", "aiLeverage", "quality"],
  required: ["summary", "impact", "aiLeverage", "quality"],
  properties: {
    summary: {
      type: "string",
    },
    impact: llmScoreDimensionJsonSchema,
    aiLeverage: llmScoreDimensionJsonSchema,
    quality: llmScoreDimensionJsonSchema,
  },
} as const;

const parseGeminiStructuredResponse = (text: string | undefined): unknown => {
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

export const scorePullRequestWithGemini = async (
  pullRequest: PullRequestScoringSource,
  repository: NormalizedRepository,
) => {
  const geminiClient = createGeminiClient();

  try {
    const response = await geminiClient.models.generateContent({
      model: geminiPullRequestScoringModel,
      contents: buildPullRequestScoringPrompt(pullRequest, repository),
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: llmPullRequestScoreJsonSchema,
      },
    });

    console.log("Gemini pull request scoring raw response", {
      repository: repository.fullName,
      pullRequestNumber: pullRequest.number,
      text: response.text,
    });

    return parseGeminiStructuredResponse(response.text);
  } catch (error) {
    console.error("Gemini pull request scoring request failed", {
      repository: repository.fullName,
      pullRequestNumber: pullRequest.number,
      message: error instanceof Error ? error.message : String(error),
      error,
    });
    throw error;
  }
};
