import { describe, expect, it } from "vitest";

import { parseRepositoryUrl } from "@/features/pr-analysis/lib/repository-url";

describe("parseRepositoryUrl", () => {
  it("normalizes supported GitHub repository URL variants", () => {
    const inputs = [
      "https://github.com/vercel/next.js",
      "https://github.com/vercel/next.js/",
      "https://github.com/vercel/next.js.git",
      "github.com/vercel/next.js",
    ];

    for (const input of inputs) {
      const result = parseRepositoryUrl(input);

      expect(result).toEqual({
        ok: true,
        value: {
          owner: "vercel",
          repo: "next.js",
          fullName: "vercel/next.js",
          canonicalUrl: "https://github.com/vercel/next.js",
        },
      });
    }
  });

  it("rejects unsupported hosts", () => {
    const result = parseRepositoryUrl("https://gitlab.com/vercel/next.js");

    expect(result).toEqual({
      ok: false,
      error: {
        code: "UNSUPPORTED_REPOSITORY_HOST",
        message: "Only github.com repository URLs are supported.",
      },
    });
  });

  it("rejects non-root GitHub resource URLs", () => {
    const result = parseRepositoryUrl("https://github.com/vercel/next.js/pull/123");

    expect(result).toEqual({
      ok: false,
      error: {
        code: "UNSUPPORTED_REPOSITORY_RESOURCE",
        message: "Use a repository root URL like https://github.com/owner/repository.",
      },
    });
  });

  it("rejects empty or malformed input", () => {
    expect(parseRepositoryUrl("")).toEqual({
      ok: false,
      error: {
        code: "INVALID_REPOSITORY_URL",
        message:
          "Enter a valid public GitHub repository URL, for example https://github.com/vercel/next.js.",
      },
    });

    expect(parseRepositoryUrl("not a url")).toEqual({
      ok: false,
      error: {
        code: "INVALID_REPOSITORY_URL",
        message:
          "Enter a valid public GitHub repository URL, for example https://github.com/vercel/next.js.",
      },
    });
  });
});
