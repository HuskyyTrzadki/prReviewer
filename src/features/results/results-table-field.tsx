import type { ReactNode } from "react";

type ResultsTableFieldProps = {
  children: ReactNode;
  className?: string;
  label: string;
};

export const ResultsTableField = ({
  children,
  className,
  label,
}: ResultsTableFieldProps) => (
  <label className={`space-y-2 ${className ?? ""}`}>
    <span className="ds-caption text-dark-slate">{label}</span>
    {children}
  </label>
);

type ResultsTableSelectFieldProps = {
  children: ReactNode;
};

export const ResultsTableSelectField = ({
  children,
}: ResultsTableSelectFieldProps) => (
  <div className="relative">
    {children}
    <span
      aria-hidden="true"
      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-cool-gray"
    >
      ▾
    </span>
  </div>
);
