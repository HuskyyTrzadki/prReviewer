import { GoogleGenAI } from "@google/genai";

const missingGoogleApiKeyMessage =
  "Missing GOOGLE_API_KEY for Gemini pull request scoring.";

export const createGeminiClient = () => {
  const apiKey = process.env.GOOGLE_API_KEY?.trim();

  if (!apiKey) {
    throw new Error(missingGoogleApiKeyMessage);
  }

  return new GoogleGenAI({ apiKey });
};

export { missingGoogleApiKeyMessage };
