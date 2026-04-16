import { describe, expect, it } from "vitest";

import {
  defaultRepositoryUrlStatusMessage,
  getRepositoryUrlFieldStatus,
  validateRepositoryUrlForSubmit,
} from "@/features/repo-input/model/repository-url-form-validation";

describe("repositoryUrlFormValidation", () => {
  it("normalizes supported repository shorthand on submit", () => {
    expect(validateRepositoryUrlForSubmit("github.com/vercel/next.js")).toEqual({
      ok: true,
      canonicalUrl: "https://github.com/vercel/next.js",
    });
  });

  it("returns the parser error for unsupported repository input", () => {
    expect(
      validateRepositoryUrlForSubmit("https://gitlab.com/vercel/next.js"),
    ).toEqual({
      ok: false,
      message: "Only github.com repository URLs are supported.",
    });
  });

  it("resets to the neutral helper text when the field is empty", () => {
    expect(getRepositoryUrlFieldStatus("")).toEqual({
      tone: "neutral",
      message: defaultRepositoryUrlStatusMessage,
    });
  });

  it("shows the normalized repository that will be analyzed once the input is valid", () => {
    expect(getRepositoryUrlFieldStatus(" github.com/vercel/next.js ")).toEqual({
      tone: "neutral",
      message: "Ready to analyze: https://github.com/vercel/next.js",
    });
  });
});
