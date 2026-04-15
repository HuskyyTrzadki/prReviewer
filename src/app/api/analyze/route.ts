import {
  analyzeRepositoryRequestSchema,
  analyzeRepositorySuccessSchema,
  type AnalysisApiErrorCode,
  analysisApiErrorSchema,
} from "@/features/pr-analysis/contracts/analysis-contracts";
import {
  getAnalysisApiErrorStatus,
  invalidAnalyzeRequestBodyMessage,
} from "@/features/pr-analysis/lib/analysis-api-errors";
import { prepareRepositoryAnalysisSource } from "@/features/pr-analysis/lib/prepare-repository-analysis-source";
import { prepareRepositoryScoringSource } from "@/features/pr-analysis/lib/prepare-repository-scoring-source";
import {
  parseRepositoryUrl,
} from "@/features/pr-analysis/lib/repository-url";
import { runRepositoryScoring } from "@/features/pr-analysis/lib/run-repository-scoring";
import { scorePullRequestsWithGemini } from "@/features/pr-analysis/lib/score-pull-request-with-gemini";

export const runtime = "nodejs";

const createErrorResponse = (code: AnalysisApiErrorCode, message: string) => {
  const payload = analysisApiErrorSchema.parse({
    status: "error",
    code,
    message,
  });

  return Response.json(payload, { status: getAnalysisApiErrorStatus(code) });
};

const createRepoId = (fullName: string) =>
  `repo_${Buffer.from(fullName, "utf8").toString("base64url")}`;

const readJsonBody = async (request: Request): Promise<unknown | null> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

export const POST = async (request: Request) => {
  const rawBody = await readJsonBody(request);

  if (rawBody === null) {
    return createErrorResponse("INVALID_REQUEST_BODY", invalidAnalyzeRequestBodyMessage);
  }

  const parsedRequest = analyzeRepositoryRequestSchema.safeParse(rawBody);

  if (!parsedRequest.success) {
    return createErrorResponse("INVALID_REQUEST_BODY", invalidAnalyzeRequestBodyMessage);
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
    return createErrorResponse(analysisSource.error.code, analysisSource.error.message);
  }

  const scoringSource = await prepareRepositoryScoringSource(analysisSource.value);

  if (!scoringSource.ok) {
    return createErrorResponse(scoringSource.error.code, scoringSource.error.message);
  }

  const scoredAnalysis = await runRepositoryScoring(
    scoringSource.value,
    scorePullRequestsWithGemini,
  );

  if (!scoredAnalysis.ok) {
    return createErrorResponse(scoredAnalysis.error.code, scoredAnalysis.error.message);
  }

  const repository = {
    owner: scoredAnalysis.value.repository.owner,
    repo: scoredAnalysis.value.repository.repo,
    fullName: scoredAnalysis.value.repository.fullName,
    canonicalUrl: scoredAnalysis.value.repository.canonicalUrl,
  };
  const repoId = createRepoId(repository.fullName);
  const payload = analyzeRepositorySuccessSchema.parse({
    status: "success",
    repository,
    repoId,
    redirectUrl: `/results/${repoId}`,
    analysis: {
      summary: scoredAnalysis.value.summary,
      pullRequests: scoredAnalysis.value.pullRequests,
      skippedPullRequests: scoredAnalysis.value.skippedPullRequests,
    },
  });

  return Response.json(payload, { status: 200 });
};
