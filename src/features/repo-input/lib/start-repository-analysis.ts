const analysisServiceUnavailableMessage =
  "We could not reach the analysis service. Try again.";

type StartRepositoryAnalysisResult =
  | {
      status: "success";
      redirectUrl: string;
      repositoryFullName: string;
    }
  | {
      status: "error";
      message: string;
    };

export const startRepositoryAnalysis = async (
  canonicalUrl: string,
): Promise<StartRepositoryAnalysisResult> => {
  try {
    const [{ submitRepositoryAnalysis }, { storeAnalysisResult }] =
      await Promise.all([
        import("@/features/repo-input/lib/submit-repository-analysis"),
        import("@/features/results/results-session"),
      ]);
    const response = await submitRepositoryAnalysis(canonicalUrl);

    if (response.status === "error") {
      return {
        status: "error",
        message: response.message,
      };
    }

    storeAnalysisResult(response);

    return {
      status: "success",
      redirectUrl: response.redirectUrl,
      repositoryFullName: response.repository.fullName,
    };
  } catch {
    return {
      status: "error",
      message: analysisServiceUnavailableMessage,
    };
  }
};
