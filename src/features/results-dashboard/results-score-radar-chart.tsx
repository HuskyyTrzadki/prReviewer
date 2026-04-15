"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

type ResultsScoreRadarChartProps = {
  aiLeverageScore: number;
  impactScore: number;
  qualityScore: number;
};

const axisLabelByDimension = {
  "AI Leverage": ["AI", "Leverage"],
  Impact: ["Impact"],
  Quality: ["Quality"],
} as const;

const RadarAxisTick = ({
  payload,
  x,
  y,
}: {
  payload?: { value?: string };
  x?: number;
  y?: number;
}) => {
  if (typeof x !== "number" || typeof y !== "number" || !payload?.value) {
    return null;
  }

  const lines =
    axisLabelByDimension[payload.value as keyof typeof axisLabelByDimension] ?? [
      payload.value,
    ];

  return (
    <text
      fill="#1d243a"
      fontFamily="Inter, sans-serif"
      fontSize="12"
      fontWeight="600"
      textAnchor="middle"
      x={x}
      y={y}
    >
      {lines.map((line, index) => (
        <tspan dy={index === 0 ? 0 : 14} key={line} x={x}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

export const ResultsScoreRadarChart = ({
  aiLeverageScore,
  impactScore,
  qualityScore,
}: ResultsScoreRadarChartProps) => {
  const data = [
    {
      dimension: "Impact",
      score: impactScore,
    },
    {
      dimension: "AI Leverage",
      score: aiLeverageScore,
    },
    {
      dimension: "Quality",
      score: qualityScore,
    },
  ];

  return (
    <div className="h-full min-h-[18rem] w-full min-w-0">
      <ResponsiveContainer height="100%" width="100%">
        <RadarChart cx="50%" cy="51%" data={data} outerRadius="74%">
          <PolarGrid gridType="polygon" stroke="#d7defd" />
          <PolarAngleAxis dataKey="dimension" tick={<RadarAxisTick />} />
          <Radar
            dataKey="score"
            fill="#4d42e0"
            fillOpacity={0.18}
            stroke="#4d42e0"
            strokeWidth={2.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
