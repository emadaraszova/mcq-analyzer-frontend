import React from "react";

import { ClinicalAnalysisItem, DataAnalysisSummaryProps } from "@/types/analysisPage";
import PieChartComponent from "./PieChart";
import AgeHistogram from "./Histogram";

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

    const keys = Object.keys(analyzedData.questions[0]) as (keyof ClinicalAnalysisItem)[];
    const summary: Record<string, string | { total: string; breakdown: string }> = {};

    const genderData: { name: string; value: number }[] = [];
    const ethnicityCounts: Record<string, number> = {};
    const ageValues: number[] = [];

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
          let ethnicity = item[key]?.replace(/-/g, " ").trim().toLowerCase();
          if (ethnicity && ethnicity !== "null" && ethnicity !== "unknown") {
          
            if (ethnicity.includes("hispanic") || ethnicity.includes("latino")) {
              ethnicity = "Hispanic";
            } else if (ethnicity.includes("asian")) {
              ethnicity = "Asian";
            } else if (ethnicity.includes("white")) {
              ethnicity = "White";
            } else if (ethnicity.includes("black")) {
              ethnicity = "Black";
            } 
      
            ethnicity = ethnicity.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

            ethnicityCounts[ethnicity] = (ethnicityCounts[ethnicity] || 0) + 1;
          }
        });

        const total = Object.values(ethnicityCounts).reduce((a, b) => a + b, 0);
        const breakdown = Object.entries(ethnicityCounts)
          .map(([eth, count]) => `${eth}: ${count}`)
          .join(", ");

        summary[key] = { total: `${total}/${totalQuestions}`, breakdown };
    
      } else if (key === "age") {
        analyzedData.questions.forEach((item) => {
          const age = item[key];
          if (age && typeof(age) !== "number" && age !== "null" && age !== "unknown") {
            ageValues.push(parseInt(age));
          } else if (typeof(age) === "number") {
            ageValues.push(age);
          }
        });

        if (ageValues.length > 0) {
          const meanAge = ageValues.reduce((a, b) => a + b, 0) / ageValues.length;
          const medianAge = ageValues.sort((a, b) => a - b)[Math.floor(ageValues.length / 2)];
          summary[key] = { total: `${ageValues.length}/${totalQuestions}`, breakdown: `Mean: ${meanAge.toFixed(2)}, Median: ${medianAge}` };
        } else {
          summary[key] = "No valid data";
        }
      } else {
        const nonNullCount = analyzedData.questions.filter((item) => item[key] && item[key] !== "null" && item[key] !== "unknown").length;
        summary[key] = `${nonNullCount}/${totalQuestions}`;
      }
    });
        
    const ethnicityData = Object.entries(ethnicityCounts).map(([name, value]) => ({ name, value }));

    return { summary, genderData, ethnicityData,ageData: ageValues };
  };

  const { summary, genderData, ethnicityData, ageData = [] } = calculateSummary();
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
          <AgeHistogram ageData={ageData} />
        </div>
      )}
    </div>
  );
};

export default DataAnalysisSummary;
