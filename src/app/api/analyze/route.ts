import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  analyzeRepositoryRequestSchema,
  analyzeRepositorySuccessSchema,
  type AnalysisApiErrorCode,
  analysisApiErrorSchema,
} from "@/features/pr-analysis/contracts/analysis-contracts";
import { prepareRepositoryAnalysisSource } from "@/features/pr-analysis/lib/prepare-repository-analysis-source";
import {
  parseRepositoryUrl,
  type RepositoryUrlErrorCode,
} from "@/features/pr-analysis/lib/repository-url";

export const runtime = "nodejs";

const createErrorResponse = (
  code: AnalysisApiErrorCode | RepositoryUrlErrorCode,
  message: string,
  status = 400,
) => {
  const payload = analysisApiErrorSchema.parse({
    status: "error",
    code,
    message,
  });

  return NextResponse.json(payload, { status });
};

const createRepoId = (fullName: string) =>
  `repo_${Buffer.from(fullName, "utf8").toString("base64url")}`;

const readJsonBody = async (request: NextRequest) => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const getErrorStatus = (code: AnalysisApiErrorCode | RepositoryUrlErrorCode) => {
  switch (code) {
    case "REPOSITORY_NOT_FOUND_OR_PRIVATE":
      return 404;
    case "NO_MERGED_PULL_REQUESTS":
      return 422;
    case "GITHUB_RATE_LIMITED":
      return 429;
    case "GITHUB_UPSTREAM_ERROR":
      return 502;
    default:
      return 400;
  }
};

export const POST = async (request: NextRequest) => {
  const rawBody = await readJsonBody(request);

  if (rawBody === null) {
    return createErrorResponse(
      "INVALID_REQUEST_BODY",
      "Request body must be valid JSON with a repositoryUrl field.",
    );
  }

  const parsedRequest = analyzeRepositoryRequestSchema.safeParse(rawBody);

  if (!parsedRequest.success) {
    return createErrorResponse(
      "INVALID_REQUEST_BODY",
      "Request body must be valid JSON with a repositoryUrl field.",
    );
  }

  const parsedRepository = parseRepositoryUrl(parsedRequest.data.repositoryUrl);

  if (!parsedRepository.ok) {
    return createErrorResponse(
      parsedRepository.error.code,
      parsedRepository.error.message,
    );
  }

  const analysisSource = await prepareRepositoryAnalysisSource(parsedRepository.value);

  if (!analysisSource.ok) {
    return createErrorResponse(
      analysisSource.error.code,
      analysisSource.error.message,
      getErrorStatus(analysisSource.error.code),
    );
  }

  const repository = {
    owner: analysisSource.value.repository.owner,
    repo: analysisSource.value.repository.repo,
    fullName: analysisSource.value.repository.fullName,
    canonicalUrl: analysisSource.value.repository.canonicalUrl,
  };
  const repoId = createRepoId(repository.fullName);
  const payload = analyzeRepositorySuccessSchema.parse({
    status: "success",
    repository,
    repoId,
    redirectUrl: `/results/${repoId}`,
  });

  return NextResponse.json(payload, { status: 200 });
};
