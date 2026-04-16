import {
  analyzeRepositorySuccessSchema,
  type AnalyzeRepositorySuccess,
  type RepoId,
} from "@/features/pr-analysis/contracts/analysis-contracts";

const analysisResultStorageKeyPrefix = "analysis-result:";
const analysisResultSnapshotCache = new Map<
  string,
  {
    rawValue: string | null;
    snapshot: StoredAnalysisResult;
  }
>();

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

const emptyStoredAnalysisResult: StoredAnalysisResult = {
  status: "empty",
};

const errorStoredAnalysisResult: StoredAnalysisResult = {
  status: "error",
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

  const key = createAnalysisResultStorageKey(payload.repoId);
  const rawValue = JSON.stringify(payload);

  resultsStorage.setItem(key, rawValue);
  analysisResultSnapshotCache.set(key, {
    rawValue,
    snapshot: {
      status: "success",
      data: payload,
    },
  });
};

const parseStoredAnalysisResult = (
  key: string,
  repoId: RepoId | string,
  rawValue: string | null,
  resultsStorage: StorageLike,
): StoredAnalysisResult => {
  if (!rawValue) {
    analysisResultSnapshotCache.set(key, {
      rawValue,
      snapshot: emptyStoredAnalysisResult,
    });
    return emptyStoredAnalysisResult;
  }

  try {
    const parsedValue = analyzeRepositorySuccessSchema.safeParse(
      JSON.parse(rawValue),
    );

    if (!parsedValue.success || parsedValue.data.repoId !== repoId) {
      resultsStorage.removeItem(key);
      analysisResultSnapshotCache.set(key, {
        rawValue: null,
        snapshot: errorStoredAnalysisResult,
      });
      return errorStoredAnalysisResult;
    }

    const snapshot: StoredAnalysisResult = {
      status: "success",
      data: parsedValue.data,
    };

    analysisResultSnapshotCache.set(key, {
      rawValue,
      snapshot,
    });

    return snapshot;
  } catch {
    resultsStorage.removeItem(key);
    analysisResultSnapshotCache.set(key, {
      rawValue: null,
      snapshot: errorStoredAnalysisResult,
    });
    return errorStoredAnalysisResult;
  }
};

export const readAnalysisResult = (
  repoId: RepoId | string,
  storage?: StorageLike,
): StoredAnalysisResult => {
  const resultsStorage = getResultsStorage(storage);

  if (!resultsStorage) {
    return emptyStoredAnalysisResult;
  }

  const key = createAnalysisResultStorageKey(repoId);
  const rawValue = resultsStorage.getItem(key);
  const cachedSnapshot = analysisResultSnapshotCache.get(key);

  if (cachedSnapshot && cachedSnapshot.rawValue === rawValue) {
    return cachedSnapshot.snapshot;
  }

  return parseStoredAnalysisResult(key, repoId, rawValue, resultsStorage);
};

export type { StoredAnalysisResult };
