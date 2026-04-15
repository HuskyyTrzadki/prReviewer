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
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-navy">{item.label}</p>
            <p className="mt-1 ds-caption text-dark-slate">{item.description}</p>
          </div>
          <p className="text-2xl font-semibold tabular-nums text-navy">
            {item.value}
          </p>
        </div>
      </div>
    ))}
  </div>
);
