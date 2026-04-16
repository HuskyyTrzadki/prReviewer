import { GoogleGenAI } from "@google/genai";

export const missingGoogleApiKeyMessage =
  "Missing GOOGLE_API_KEY for Gemini pull request scoring.";

const getGoogleApiKey = () => {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(missingGoogleApiKeyMessage);
  }

  return apiKey;
};

export const isMissingGoogleApiKeyError = (error: unknown) =>
  error instanceof Error && error.message === missingGoogleApiKeyMessage;

export const assertGoogleApiKeyConfigured = () => {
  getGoogleApiKey();
};

export const createGeminiClient = () =>
  new GoogleGenAI({ apiKey: getGoogleApiKey() });
