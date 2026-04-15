import {
  analyzeRepositorySuccessSchema,
  type AnalyzeRepositorySuccess,
  type RepoId,
} from "@/features/pr-analysis/contracts/analysis-contracts";

const analysisResultStorageKeyPrefix = "analysis-result:";

type StorageLike = Pick<Storage, "getItem" | "removeItem" | "setItem">;

type StoredAnalysisResult =
  | {
      status: "success";
      data: AnalyzeRepositorySuccess;
    }
  | {
      status: "empty";
    }
  | {
      status: "error";
    };

const getResultsStorage = (storage?: StorageLike) => {
  if (storage) {
    return storage;
  }

  if (typeof window === "undefined") {
    return null;
  }

  return window.sessionStorage;
};

export const createAnalysisResultStorageKey = (repoId: RepoId | string) =>
  `${analysisResultStorageKeyPrefix}${repoId}`;

export const storeAnalysisResult = (
  payload: AnalyzeRepositorySuccess,
  storage?: StorageLike,
) => {
  const resultsStorage = getResultsStorage(storage);

  if (!resultsStorage) {
    return;
  }

  resultsStorage.setItem(
    createAnalysisResultStorageKey(payload.repoId),
    JSON.stringify(payload),
  );
};

export const readAnalysisResult = (
  repoId: RepoId | string,
  storage?: StorageLike,
): StoredAnalysisResult => {
  const resultsStorage = getResultsStorage(storage);

  if (!resultsStorage) {
    return { status: "empty" };
  }

  const key = createAnalysisResultStorageKey(repoId);
  const rawValue = resultsStorage.getItem(key);

  if (!rawValue) {
    return { status: "empty" };
  }

  try {
    const parsedValue = analyzeRepositorySuccessSchema.safeParse(
      JSON.parse(rawValue),
    );

    if (!parsedValue.success || parsedValue.data.repoId !== repoId) {
      resultsStorage.removeItem(key);
      return { status: "error" };
    }

    return {
      status: "success",
      data: parsedValue.data,
    };
  } catch {
    resultsStorage.removeItem(key);
    return { status: "error" };
  }
};

export type { StoredAnalysisResult };
