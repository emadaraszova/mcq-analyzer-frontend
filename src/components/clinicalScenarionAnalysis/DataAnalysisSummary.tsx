import React from "react";
import { ClinicalQuestion, DataAnalysisSummaryProps } from "@/types";
import PieChartComponent from "./PieChart";

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
      return { summary: {}, genderData: [], ethnicityData: [] };
    }

    const totalQuestions = analyzedData.questions.length;

    const keys = Object.keys(analyzedData.questions[0]) as (keyof ClinicalQuestion)[];
    const summary: Record<string, string | { total: string; breakdown: string }> = {};

    const genderData: { name: string; value: number }[] = [];
    const ethnicityCounts: Record<string, number> = {};

    keys.forEach((key) => {
      if (key === "gender") {
        const genderCounts = analyzedData.questions.reduce(
          (counts, item) => {
            const gender = item[key]?.trim().toLowerCase();
            if (gender && gender !== "null" && gender !== "unknown") {
              if (["male", "boy", "man"].includes(gender)) counts.male += 1;
              if (["female", "girl", "woman"].includes(gender)) counts.female += 1;
            }
            return counts;
          },
          { male: 0, female: 0 }
        );

        genderData.push(
          { name: "Male", value: genderCounts.male },
          { name: "Female", value: genderCounts.female }
        );

        summary[key] = { total: `${genderCounts.male + genderCounts.female}/${totalQuestions}`, breakdown: `Male: ${genderCounts.male}, Female: ${genderCounts.female}` };
      } else if (key === "ethnicity") {
        analyzedData.questions.forEach((item) => {
          const ethnicity = item[key]?.replace(/-/g, " ").trim();
          if (ethnicity && ethnicity !== "null" && ethnicity !== "unknown") {
            ethnicityCounts[ethnicity] = (ethnicityCounts[ethnicity] || 0) + 1;
          }
        });

        const total = Object.values(ethnicityCounts).reduce((a, b) => a + b, 0);
        const breakdown = Object.entries(ethnicityCounts)
          .map(([eth, count]) => `${eth}: ${count}`)
          .join(", ");

        summary[key] = { total: `${total}/${totalQuestions}`, breakdown };
      } else {
        const nonNullCount = analyzedData.questions.filter((item) => item[key] && item[key] !== "null" && item[key] !== "unknown").length;
        summary[key] = `${nonNullCount}/${totalQuestions}`;
      }
    });

    const ethnicityData = Object.entries(ethnicityCounts).map(([name, value]) => ({ name, value }));

    return { summary, genderData, ethnicityData };
  };

  const { summary, genderData, ethnicityData } = calculateSummary();

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-md">
      {Object.keys(summary).length === 0 ? (
        <div className="text-center text-slate-500">No data available for analysis.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(summary).map(([key, value]) => (
            <div key={key} className="flex flex-col bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">{key}:</span>
                <span className="text-slate-800 font-bold">{typeof value === "string" ? value : value.total}</span>
              </div>
              {typeof value === "object" && (
                <div className="text-sky-700 text-sm font-bold mt-2">{value.breakdown}</div>
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <PieChartComponent title="Gender Distribution" data={genderData} />
            <PieChartComponent title="Ethnicity Distribution" data={ethnicityData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysisSummary;
