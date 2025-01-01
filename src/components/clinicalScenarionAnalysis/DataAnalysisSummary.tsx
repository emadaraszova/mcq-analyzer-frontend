import React from "react";
import { ClinicalAnalysisResult } from "@/types";

interface DataAnalysisSummaryProps {
  analyzedData: ClinicalAnalysisResult[];
}

const DataAnalysisSummary: React.FC<DataAnalysisSummaryProps> = ({
  analyzedData,
}) => {
  const calculateSummary = () => {
    const totalQuestions = analyzedData.length;

    // Initialize a summary object for all keys in ClinicalAnalysisResult
    const keys = Object.keys(
      analyzedData[0]
    ) as (keyof ClinicalAnalysisResult)[];
    const summary: Record<string, string> = {};

    keys.forEach((key) => {
      const nonNullCount = analyzedData.filter(
        (item) => item[key] !== null && item[key] !== "" && item[key] !== "null"
      ).length;
      summary[key] = `${nonNullCount}/${totalQuestions}`;
    });

    return summary;
  };

  const summary = calculateSummary();

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 gap-2">
        {Object.entries(summary).map(([key, value]) => (
          <div
            key={key}
            className="flex justify-between items-center bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200"
          >
            <span className="text-slate-600 font-bold">{key}:</span>
            <span className="text-slate-800 font-bold">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataAnalysisSummary;
