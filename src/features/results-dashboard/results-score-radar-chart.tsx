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

const labelStyle = {
  fill: "#1d243a",
  fontFamily: "Inter, sans-serif",
  fontSize: 12,
  fontWeight: 600,
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
    <div className="h-[13.5rem] w-full min-w-0">
      <ResponsiveContainer height="100%" width="100%">
        <RadarChart cx="50%" cy="50%" data={data} outerRadius="64%">
          <PolarGrid gridType="polygon" stroke="#d7defd" />
          <PolarAngleAxis dataKey="dimension" tick={labelStyle} />
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
