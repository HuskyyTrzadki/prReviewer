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
  propertyOrdering: ["number", "summary", "impact", "aiLeverage", "quality"],
  required: ["number", "summary", "impact", "aiLeverage", "quality"],
  properties: {
    number: {
      type: "number",
    },
    summary: {
      type: "string",
    },
    impact: llmScoreDimensionJsonSchema,
    aiLeverage: llmScoreDimensionJsonSchema,
    quality: llmScoreDimensionJsonSchema,
  },
} as const;

const llmPullRequestBatchScoreJsonSchema = {
  type: "object",
  additionalProperties: false,
  required: ["pullRequests"],
  properties: {
    pullRequests: {
      type: "array",
      items: llmPullRequestScoreJsonSchema,
    },
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

export const scorePullRequestsWithGemini = async (
  pullRequests: PullRequestScoringSource[],
  repository: NormalizedRepository,
) => {
  const geminiClient = createGeminiClient();
  const prompt = buildPullRequestScoringPrompt(pullRequests, repository);

  try {
    const response = await geminiClient.models.generateContent({
      model: geminiPullRequestScoringModel,
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseJsonSchema: llmPullRequestBatchScoreJsonSchema,
      },
    });

    return parseGeminiStructuredResponse(response.text);
  } catch (error) {
    console.error("Gemini scoring request failed", {
      repository: repository.fullName,
      pullRequestNumbers: pullRequests.map((pullRequest) => pullRequest.number),
      model: geminiPullRequestScoringModel,
      promptLength: prompt.length,
      message: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
};
