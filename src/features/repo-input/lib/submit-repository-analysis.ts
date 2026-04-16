import {
  analyzeRepositoryResponseSchema,
  type AnalyzeRepositoryResponse,
} from "@/features/pr-analysis/contracts/analysis-contracts";

export const invalidAnalyzeRepositoryResponseMessage =
  "The analysis service returned an invalid response. Try again.";

export const submitRepositoryAnalysis = async (
  repositoryUrl: string,
  fetchFn: typeof fetch = fetch,
): Promise<AnalyzeRepositoryResponse> => {
  const response = await fetchFn("/api/analyze", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ repositoryUrl }),
  });

  const rawPayload = await response.json().catch(() => null);
  const parsedPayload = analyzeRepositoryResponseSchema.safeParse(rawPayload);

  if (!parsedPayload.success) {
    throw new Error(invalidAnalyzeRepositoryResponseMessage);
  }

  return parsedPayload.data;
};
