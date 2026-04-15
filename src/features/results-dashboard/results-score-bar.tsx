type ResultsScoreBarProps = {
  label: string;
  value: number;
};

export const ResultsScoreBar = ({
  label,
  value,
}: ResultsScoreBarProps) => {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-4">
        <span className="text-sm font-medium text-navy">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-navy">
          {value}
        </span>
      </div>
      <div className="h-3 rounded-full bg-soft-indigo">
        <div
          className="h-full rounded-full bg-indigo-violet"
          style={{
            width: `${value}%`,
          }}
        />
      </div>
    </div>
  );
};
