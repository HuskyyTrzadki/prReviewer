import type { CSSProperties } from "react";

import { maxScoreValue } from "@/features/results-dashboard/results-score-constants";

type ResultsScoreCircleSize = "lg" | "md" | "sm";

type ResultsScoreCircleProps = {
  className?: string;
  showDenominator?: boolean;
  size?: ResultsScoreCircleSize;
  value: number;
};

const sizeByVariant = {
  lg: {
    circle: "size-[14.5rem]",
    denominator: "text-lg",
    divider: "w-9",
    number: "text-[4.6rem]",
    ring: 12,
    svg: 232,
  },
  md: {
    circle: "size-[7.75rem]",
    denominator: "text-xs",
    divider: "w-5",
    number: "text-[2.35rem]",
    ring: 8,
    svg: 124,
  },
  sm: {
    circle: "size-[5rem]",
    denominator: "text-[0.625rem]",
    divider: "w-4",
    number: "text-[1.45rem]",
    ring: 6,
    svg: 80,
  },
} as const;

const clampScore = (value: number) =>
  Math.max(0, Math.min(maxScoreValue, value));

export const ResultsScoreCircle = ({
  className,
  showDenominator = true,
  size = "md",
  value,
}: ResultsScoreCircleProps) => {
  const clampedValue = clampScore(value);
  const preset = sizeByVariant[size];
  const radius = (preset.svg - preset.ring) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clampedValue / maxScoreValue);
  const style = {
    "--score-circle-dasharray": `${circumference}`,
    "--score-circle-offset": `${offset}`,
  } as CSSProperties;

  return (
    <div
      className={`relative inline-flex ${preset.circle} items-center justify-center ${
        className ?? ""
      }`}
      style={style}
    >
      <svg
        className="absolute inset-0 h-full w-full -rotate-90"
        fill="none"
        viewBox={`0 0 ${preset.svg} ${preset.svg}`}
      >
        <circle
          cx={preset.svg / 2}
          cy={preset.svg / 2}
          r={radius}
          stroke="#d7defd"
          strokeWidth={preset.ring}
        />
        <circle
          className="ds-score-circle-progress"
          cx={preset.svg / 2}
          cy={preset.svg / 2}
          r={radius}
          stroke="#4d42e0"
          strokeLinecap="round"
          strokeWidth={preset.ring}
        />
      </svg>

      <div className="relative z-10 flex flex-col items-center justify-center rounded-full bg-ice-blue/75 text-center">
        <span
          className={`font-serif ${preset.number} leading-none tracking-[-0.05em] text-navy tabular-nums`}
        >
          {clampedValue}
        </span>
        {showDenominator ? (
          <div className="mt-2 flex flex-col items-center gap-1">
            <span className={`h-px bg-dark-slate/30 ${preset.divider}`} />
            <span className={`${preset.denominator} font-medium text-dark-slate`}>
              {maxScoreValue}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
