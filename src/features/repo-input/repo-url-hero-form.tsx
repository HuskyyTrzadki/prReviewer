"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ComponentProps } from "react";

import { AnalysisLoadingPanel } from "@/features/repo-input/analysis-loading-panel";
import { submitRepositoryAnalysis } from "@/features/repo-input/submit-repository-analysis";
import { storeAnalysisResult } from "@/features/results-dashboard/results-session";

const DEFAULT_REPOSITORY_URL = "https://github.com/vercel/next.js";
const defaultStatusMessage = `Ready to analyze: ${DEFAULT_REPOSITORY_URL}`;
const analysisServiceUnavailableMessage =
  "We could not reach the analysis service. Try again.";
type FormStatusTone = "neutral" | "success" | "error";
const statusClassNamesByTone: Record<FormStatusTone, string> = {
  neutral: "ds-caption text-navy",
  success: "ds-caption text-success-green",
  error: "ds-caption text-error-red",
};

export const RepoUrlHeroForm = () => {
  const router = useRouter();
  const [repositoryUrl, setRepositoryUrl] = useState(DEFAULT_REPOSITORY_URL);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTick, setLoadingTick] = useState(0);
  const [statusMessage, setStatusMessage] = useState(defaultStatusMessage);
  const [statusTone, setStatusTone] = useState<FormStatusTone>("neutral");

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingTick(0);
      return;
    }

    const intervalId = window.setInterval(() => {
      setLoadingTick((currentTick) => currentTick + 1);
    }, 2400);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isSubmitting]);

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (
    event,
  ) => {
    event.preventDefault();

    const trimmedRepositoryUrl = repositoryUrl.trim();

    setRepositoryUrl(trimmedRepositoryUrl);
    setIsSubmitting(true);
    setStatusTone("neutral");
    setStatusMessage("Starting repository analysis...");

    try {
      const response = await submitRepositoryAnalysis(trimmedRepositoryUrl);

      if (response.status === "error") {
        setStatusTone("error");
        setStatusMessage(response.message);
        return;
      }

      setStatusTone("success");
      setStatusMessage(
        `Repository found. Opening results for ${response.repository.fullName}...`,
      );
      storeAnalysisResult(response);
      router.push(response.redirectUrl);
    } catch {
      setStatusTone("error");
      setStatusMessage(analysisServiceUnavailableMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusClassName = statusClassNamesByTone[statusTone];

  return (
    <form aria-busy={isSubmitting} className="w-full" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="repository-url">
        Public GitHub Repository URL
      </label>

      <div className="ds-surface p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            aria-describedby="repository-url-note repository-url-status"
            aria-invalid={statusTone === "error"}
            autoComplete="url"
            className={`ds-input h-14 flex-1 text-base sm:text-lg ${
              statusTone === "error" ? "ds-input-error" : ""
            }`}
            disabled={isSubmitting}
            id="repository-url"
            inputMode="url"
            name="repositoryUrl"
            onChange={(event) => setRepositoryUrl(event.target.value)}
            placeholder="https://github.com/owner/repository…"
            required
            spellCheck={false}
            type="url"
            value={repositoryUrl}
          />

          <button
            className="ds-button-primary h-14 px-8 text-base sm:min-w-56 sm:text-lg"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Analyzing..." : "Analyze Repository"}
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-left">
          <p className="ds-caption" id="repository-url-note">
            Public repositories only.
          </p>
          <p
            aria-live="polite"
            className={statusClassName}
            id="repository-url-status"
            role={statusTone === "error" ? "alert" : "status"}
          >
            {statusMessage}
          </p>
        </div>

        {isSubmitting ? <AnalysisLoadingPanel tick={loadingTick} /> : null}
      </div>
    </form>
  );
};
