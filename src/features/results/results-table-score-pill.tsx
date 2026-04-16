type ResultsTableScorePillProps = {
  label: string;
  value: number;
};

export const ResultsTableScorePill = ({
  label,
  value,
}: ResultsTableScorePillProps) => (
  <span className="rounded-full border border-silver bg-white px-3 py-2 text-sm font-medium text-dark-slate">
    {label}: <span className="font-semibold tabular-nums text-navy">{value}</span>
  </span>
);
