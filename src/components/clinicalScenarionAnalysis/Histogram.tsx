import { AgeHistogramProps } from "@/types";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";


const AgeHistogram: React.FC<AgeHistogramProps> = ({ ageData }) => {
  if (!ageData.length) {
    return <div className="text-center text-slate-500">No age data available</div>;
  }

  const minAge = Math.min(...ageData);
  const maxAge = Math.max(...ageData);
  const binSize = 5;
  const bins: Record<string, number> = {};

  for (let i = minAge; i <= maxAge; i += binSize) {
    bins[`${i}-${i + binSize - 1}`] = 0;
  }

  ageData.forEach((age) => {
    const binKey = `${Math.floor(age / binSize) * binSize}-${Math.floor(age / binSize) * binSize + binSize - 1}`;
    bins[binKey] = (bins[binKey] || 0) + 1;
  });

  const histogramData = Object.entries(bins).map(([range, count]) => ({
    range,
    count,
  }));

  return (
    <div className="p-4 bg-slate-100 rounded-lg shadow-md">
      <h2 className="text-center text-lg font-semibold text-gray-700 mb-3">Age Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={histogramData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
          <XAxis dataKey="range" label={{ value: "Age Range", position: "insideBottom", offset: -5 }} />
          <YAxis allowDecimals={false} label={{ value: "Count", angle: -90, position: "insideLeft" }} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgeHistogram;
