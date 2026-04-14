"use client";

import { useState, type SyntheticEvent } from "react";

const DEFAULT_REPOSITORY_URL = "https://github.com/vercel/next.js";

export const RepoUrlHeroForm = () => {
  const [repositoryUrl, setRepositoryUrl] = useState(DEFAULT_REPOSITORY_URL);
  const [submittedUrl, setSubmittedUrl] = useState(DEFAULT_REPOSITORY_URL);

  const handleSubmit = (
    event: SyntheticEvent<HTMLFormElement, SubmitEvent>,
  ) => {
    event.preventDefault();
    setSubmittedUrl(repositoryUrl.trim());
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="repository-url">
        Public GitHub Repository URL
      </label>

      <div className="ds-surface p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            aria-describedby="repository-url-note repository-url-status"
            autoComplete="url"
            className="ds-input h-14 flex-1 text-base sm:text-lg"
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
            type="submit"
          >
            Analyze Repository
          </button>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-left">
          <p className="ds-caption" id="repository-url-note">
            Public repositories only.
          </p>
          <p
            aria-live="polite"
            className="ds-caption text-navy"
            id="repository-url-status"
          >
            Ready to analyze:{" "}
            <span className="font-medium break-all">{submittedUrl}</span>
          </p>
        </div>
      </div>
    </form>
  );
};
