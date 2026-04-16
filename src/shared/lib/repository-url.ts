export const repositoryUrlErrorCodes = [
  "INVALID_REPOSITORY_URL",
  "UNSUPPORTED_REPOSITORY_HOST",
  "UNSUPPORTED_REPOSITORY_RESOURCE",
] as const;

type RepositoryUrlErrorCode = (typeof repositoryUrlErrorCodes)[number];

type RepositoryUrlError = {
  code: RepositoryUrlErrorCode;
  message: string;
};

type ParsedRepositoryUrl = {
  owner: string;
  repo: string;
  fullName: string;
  canonicalUrl: string;
};

type ParseRepositoryUrlResult =
  | {
      ok: true;
      value: ParsedRepositoryUrl;
    }
  | {
      ok: false;
      error: RepositoryUrlError;
    };

const GITHUB_HOSTNAME = "github.com";
const INVALID_URL_MESSAGE =
  "Enter a valid public GitHub repository URL, for example https://github.com/vercel/next.js.";

const createRepositoryUrlError = (
  code: RepositoryUrlErrorCode,
  message: string,
): ParseRepositoryUrlResult => ({
  ok: false,
  error: { code, message },
});

const normalizeInputToUrl = (input: string) => {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return createRepositoryUrlError("INVALID_REPOSITORY_URL", INVALID_URL_MESSAGE);
  }

  const normalizedInput = /^[a-z]+:\/\//i.test(trimmedInput)
    ? trimmedInput
    : `https://${trimmedInput}`;

  try {
    return new URL(normalizedInput);
  } catch {
    return createRepositoryUrlError("INVALID_REPOSITORY_URL", INVALID_URL_MESSAGE);
  }
};

const sanitizeRepositorySegment = (segment: string) => {
  const trimmedSegment = segment.trim();

  if (!trimmedSegment || trimmedSegment === "." || trimmedSegment === "..") {
    return null;
  }

  return trimmedSegment;
};

export const parseRepositoryUrl = (input: string): ParseRepositoryUrlResult => {
  const parsedUrl = normalizeInputToUrl(input);

  if (!(parsedUrl instanceof URL)) {
    return parsedUrl;
  }

  if (parsedUrl.hostname !== GITHUB_HOSTNAME) {
    return createRepositoryUrlError(
      "UNSUPPORTED_REPOSITORY_HOST",
      "Only github.com repository URLs are supported.",
    );
  }

  if (parsedUrl.username || parsedUrl.password || parsedUrl.search || parsedUrl.hash) {
    return createRepositoryUrlError(
      "UNSUPPORTED_REPOSITORY_RESOURCE",
      "Use the root repository URL without extra query parameters, fragments, or credentials.",
    );
  }

  const pathSegments = parsedUrl.pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.trim());

  if (pathSegments.length !== 2) {
    return createRepositoryUrlError(
      "UNSUPPORTED_REPOSITORY_RESOURCE",
      "Use a repository root URL like https://github.com/owner/repository.",
    );
  }

  const owner = sanitizeRepositorySegment(pathSegments[0]);
  const repoSegment = sanitizeRepositorySegment(pathSegments[1]);

  if (!owner || !repoSegment) {
    return createRepositoryUrlError("INVALID_REPOSITORY_URL", INVALID_URL_MESSAGE);
  }

  const repo = repoSegment.replace(/\.git$/i, "");

  if (!repo) {
    return createRepositoryUrlError("INVALID_REPOSITORY_URL", INVALID_URL_MESSAGE);
  }

  const fullName = `${owner}/${repo}`;

  return {
    ok: true,
    value: {
      owner,
      repo,
      fullName,
      canonicalUrl: `https://${GITHUB_HOSTNAME}/${fullName}`,
    },
  };
};
