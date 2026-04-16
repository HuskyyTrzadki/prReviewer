import { parseRepositoryUrl } from "@/shared/lib/repository-url";

export const defaultRepositoryUrlStatusMessage =
  "Paste a public GitHub repository URL to start analysis.";

type RepositoryUrlFieldStatus =
  | {
      tone: "neutral";
      message: string;
    }
  | {
      tone: "error";
      message: string;
    };

type RepositoryUrlSubmitValidation =
  | {
      ok: true;
      canonicalUrl: string;
    }
  | {
      ok: false;
      message: string;
    };

export const getRepositoryUrlFieldStatus = (
  input: string,
): RepositoryUrlFieldStatus => {
  if (!input.trim()) {
    return {
      tone: "neutral",
      message: defaultRepositoryUrlStatusMessage,
    };
  }

  const result = parseRepositoryUrl(input);

  if (!result.ok) {
    return {
      tone: "error",
      message: result.error.message,
    };
  }

  return {
    tone: "neutral",
    message: `Ready to analyze: ${result.value.canonicalUrl}`,
  };
};

export const validateRepositoryUrlForSubmit = (
  input: string,
): RepositoryUrlSubmitValidation => {
  const result = parseRepositoryUrl(input);

  if (!result.ok) {
    return {
      ok: false,
      message: result.error.message,
    };
  }

  return {
    ok: true,
    canonicalUrl: result.value.canonicalUrl,
  };
};
