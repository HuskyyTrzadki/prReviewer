import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";

type ResultsPrPreviewCardProps = {
  pullRequest: ScoredPullRequest;
};

const scorePills = (pullRequest: ScoredPullRequest) => [
  {
    label: "Impact",
    value: pullRequest.impactScore,
  },
  {
    label: "AI Leverage",
    value: pullRequest.aiLeverageScore,
  },
  {
    label: "Quality",
    value: pullRequest.qualityScore,
  },
];

export const ResultsPrPreviewCard = ({
  pullRequest,
}: ResultsPrPreviewCardProps) => {
  return (
    <article className="rounded-md border border-silver bg-ice-blue px-5 py-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-2">
            <p className="ds-caption text-dark-slate">
              PR #{pullRequest.number} · {pullRequest.authorLogin ?? "Unknown author"} ·{" "}
              {pullRequest.changedFiles} files · +{pullRequest.additions}/-
              {pullRequest.deletions}
            </p>
            <h3 className="text-lg font-semibold leading-7 text-navy">
              {pullRequest.title}
            </h3>
            <p className="ds-body-secondary">{pullRequest.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {scorePills(pullRequest).map((scorePill) => (
              <span
                className="rounded-full border border-silver bg-white px-3 py-2 text-sm font-medium text-dark-slate"
                key={scorePill.label}
              >
                {scorePill.label}:{" "}
                <span className="font-semibold text-navy">
                  {scorePill.value}
                </span>
              </span>
            ))}
          </div>

          <a
            className="inline-flex text-sm font-medium text-indigo-violet transition-colors hover:text-indigo-violet-hover"
            href={pullRequest.htmlUrl}
            rel="noreferrer"
            target="_blank"
          >
            Open pull request
          </a>
        </div>

        <div className="shrink-0 rounded-md border border-silver bg-white px-4 py-3 text-right">
          <p className="ds-caption text-dark-slate">Overall</p>
          <p className="mt-1 text-3xl font-semibold tabular-nums text-navy">
            {pullRequest.overallScore}
          </p>
        </div>
      </div>
    </article>
  );
};
