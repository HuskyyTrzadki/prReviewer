import { maxScoreValue } from "@/features/results-dashboard/results-score-constants";

type ResultsScoreBreakdownItem = {
  description: string;
  label: string;
  value: number;
};

type ResultsScoreBreakdownListProps = {
  items: ResultsScoreBreakdownItem[];
};

export const ResultsScoreBreakdownList = ({
  items,
}: ResultsScoreBreakdownListProps) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div
        className="rounded-md border border-silver bg-white px-4 py-4"
        key={item.label}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-navy">{item.label}</p>
            <p className="mt-1 ds-caption text-dark-slate">{item.description}</p>
          </div>
          <div className="w-[3.5rem] shrink-0 text-right">
            <p className="text-[2rem] font-semibold leading-none tabular-nums text-navy">
              {item.value}
            </p>
            <div className="mt-2 flex flex-col items-end gap-1">
              <span className="h-px w-6 bg-dark-slate/30" />
              <p className="ds-caption text-dark-slate">{maxScoreValue}</p>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);
