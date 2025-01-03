import { ClinicalQuestion, DataAnalysisSummaryProps } from "@/types";
import React from "react";

const DataAnalysisSummary: React.FC<DataAnalysisSummaryProps> = ({
  analyzedData,
}) => {
  const calculateSummary = () => {
    if (
      !analyzedData ||
      !Array.isArray(analyzedData.questions) ||
      analyzedData.questions.length === 0
    ) {
      console.warn("No analyzed data provided or questions array is invalid.");
      return {};
    }

    const totalQuestions = analyzedData.questions.length;

    // Initialize a summary object for all keys in ClinicalQuestion
    const keys = Object.keys(
      analyzedData.questions[0]
    ) as (keyof ClinicalQuestion)[];
    const summary: Record<string, string> = {};

    keys.forEach((key) => {
      const nonNullCount = analyzedData.questions.filter(
        (item) => item[key] !== null && item[key] !== "" && item[key] !== "null"
      ).length;
      summary[key] = `${nonNullCount}/${totalQuestions}`;
    });

    return summary;
  };

  const summary = calculateSummary();

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-md">
      {Object.keys(summary).length === 0 ? (
        <div className="text-center text-slate-500">
          No data available for analysis.
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default DataAnalysisSummary;
