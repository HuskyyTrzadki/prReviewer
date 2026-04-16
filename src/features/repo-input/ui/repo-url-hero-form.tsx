"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ComponentProps } from "react";

import { startRepositoryAnalysis } from "@/features/repo-input/lib/start-repository-analysis";
import {
  defaultRepositoryUrlStatusMessage,
  getRepositoryUrlFieldStatus,
  validateRepositoryUrlForSubmit,
} from "@/features/repo-input/model/repository-url-form-validation";
import { AnalysisLoadingPanel } from "@/features/repo-input/ui/analysis-loading-panel";

const DEFAULT_REPOSITORY_URL = "";
const loadingTickIntervalMs = 3200;
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
  const [statusMessage, setStatusMessage] = useState(
    defaultRepositoryUrlStatusMessage,
  );
  const [statusTone, setStatusTone] = useState<FormStatusTone>("neutral");

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setLoadingTick((currentTick) => currentTick + 1);
    }, loadingTickIntervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isSubmitting]);

  const handleSubmit: NonNullable<ComponentProps<"form">["onSubmit"]> = async (
    event,
  ) => {
    event.preventDefault();

    const validationResult = validateRepositoryUrlForSubmit(repositoryUrl);

    if (!validationResult.ok) {
      setRepositoryUrl(repositoryUrl.trim());
      setStatusTone("error");
      setStatusMessage(validationResult.message);
      return;
    }

    setRepositoryUrl(validationResult.canonicalUrl);
    setLoadingTick(0);
    setIsSubmitting(true);
    setStatusTone("neutral");
    setStatusMessage("Starting repository analysis...");

    const response = await startRepositoryAnalysis(validationResult.canonicalUrl);

    if (response.status === "success") {
      setStatusTone("success");
      setStatusMessage(
        `Repository found. Opening results for ${response.repositoryFullName}...`,
      );
      router.push(response.redirectUrl);
    } else {
      setStatusTone("error");
      setStatusMessage(response.message);
    }

    setIsSubmitting(false);
  };

  const statusClassName = statusClassNamesByTone[statusTone];
  const handleChange: NonNullable<ComponentProps<"input">["onChange"]> = (
    event,
  ) => {
    const nextRepositoryUrl = event.target.value;

    setRepositoryUrl(nextRepositoryUrl);

    if (statusTone !== "error") {
      return;
    }

    const nextStatus = getRepositoryUrlFieldStatus(nextRepositoryUrl);

    setStatusTone(nextStatus.tone);
    setStatusMessage(nextStatus.message);
  };
  const handleBlur: NonNullable<ComponentProps<"input">["onBlur"]> = () => {
    const nextStatus = getRepositoryUrlFieldStatus(repositoryUrl);

    setStatusTone(nextStatus.tone);
    setStatusMessage(nextStatus.message);
  };

  return (
    <form
      aria-busy={isSubmitting}
      className="w-full"
      noValidate
      onSubmit={handleSubmit}
    >
      <label className="sr-only" htmlFor="repository-url">
        Public GitHub Repository URL
      </label>

      <div className="ds-surface p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            aria-describedby="repository-url-note repository-url-status"
            aria-invalid={statusTone === "error"}
            autoComplete="url"
            className={`ds-input ds-input-hero flex-1 ${
              statusTone === "error" ? "ds-input-error" : ""
            }`}
            disabled={isSubmitting}
            id="repository-url"
            inputMode="url"
            name="repositoryUrl"
            onBlur={handleBlur}
            onChange={handleChange}
            placeholder="https://github.com/owner/repository…"
            required
            spellCheck={false}
            type="text"
            value={repositoryUrl}
          />

          <button
            className="ds-button-primary h-16 px-8 text-lg sm:h-14 sm:text-lg"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Analyzing..." : "Analyze "}
          </button>
        </div>

        {isSubmitting ? <AnalysisLoadingPanel tick={loadingTick} /> : null}
      </div>

      <div className="mt-3 flex flex-col gap-2 px-1 text-left">
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
    </form>
  );
};
