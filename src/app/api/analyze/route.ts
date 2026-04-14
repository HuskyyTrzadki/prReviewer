import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  analyzeRepositoryRequestSchema,
  analyzeRepositorySuccessSchema,
  analysisApiErrorSchema,
} from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  parseRepositoryUrl,
  type RepositoryUrlErrorCode,
} from "@/features/pr-analysis/lib/repository-url";

export const runtime = "nodejs";

const createErrorResponse = (
  code: "INVALID_REQUEST_BODY" | RepositoryUrlErrorCode,
  message: string,
) => {
  const payload = analysisApiErrorSchema.parse({
    status: "error",
    code,
    message,
  });

  return NextResponse.json(payload, { status: 400 });
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

  const repoId = createRepoId(parsedRepository.value.fullName);
  const payload = analyzeRepositorySuccessSchema.parse({
    status: "success",
    repository: parsedRepository.value,
    repoId,
    redirectUrl: `/results/${repoId}`,
  });

  return NextResponse.json(payload, { status: 200 });
};
