import type { ScoredPullRequest } from "@/features/pr-analysis/contracts/scoring-contracts";
import { ScoreCircle } from "@/shared/ui/score-circle";

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
    <article className="rounded-md border border-silver bg-ice-blue px-5 py-5 sm:px-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="text-sm font-semibold text-navy">
              PR #{pullRequest.number}
            </span>
            <span className="ds-caption text-dark-slate">
              {pullRequest.authorLogin ?? "Unknown author"}
            </span>
            <span className="ds-caption text-dark-slate">
              {pullRequest.changedFiles}{" "}
              {pullRequest.changedFiles === 1 ? "file" : "files"}
            </span>
            <span className="text-sm font-medium tabular-nums text-success-green">
              +{pullRequest.additions}
            </span>
            <span className="text-sm font-medium tabular-nums text-error-red">
              -{pullRequest.deletions}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold leading-7 text-navy">
              {pullRequest.title}
            </h3>
            <p className="max-w-[48rem] ds-body-secondary">{pullRequest.summary}</p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {scorePills(pullRequest).map((scorePill) => (
              <div
                className="rounded-full border border-silver bg-white px-3 py-2"
                key={scorePill.label}
              >
                <span className="text-sm font-medium text-dark-slate">
                  {scorePill.label}:{" "}
                </span>
                <span className="text-sm font-semibold tabular-nums text-navy">
                  {scorePill.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              className="ds-button-secondary h-10 px-4 text-sm"
              href={pullRequest.htmlUrl}
              rel="noreferrer"
              target="_blank"
            >
              Open PR
            </a>
            <a
              className="inline-flex text-sm font-medium text-indigo-violet transition-colors hover:text-indigo-violet-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-violet/20 focus-visible:ring-offset-2"
              href={`${pullRequest.htmlUrl}/files`}
              rel="noreferrer"
              target="_blank"
            >
              View Diff
            </a>
          </div>
        </div>

        <div className="shrink-0 rounded-md border border-silver bg-white px-5 py-4 sm:min-w-[9.5rem] sm:self-start sm:text-center">
          <p className="ds-caption text-dark-slate">Overall score</p>
          <div className="mt-3 flex justify-center">
            <ScoreCircle showDenominator={false} size="md" value={pullRequest.overallScore} />
          </div>
          <p className="mt-2 ds-caption text-dark-slate">
            From impact, AI leverage, and quality.
          </p>
        </div>
      </div>
    </article>
  );
};
