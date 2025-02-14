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
      return { summary: {}, genderData: [], ethnicityData: [] }; // Always return defaults
    }

    const totalQuestions = analyzedData.questions.length;

    const keys = Object.keys(
      analyzedData.questions[0]
    ) as (keyof ClinicalQuestion)[];
    const summary: Record<
      string,
      string | { total: string; breakdown: string }
    > = {};

    const genderData: { name: string; value: number }[] = [];
    const ethnicityData: { name: string; value: number }[] = [];

    keys.forEach((key) => {
      if (key === "gender") {
        const genderCounts = analyzedData.questions.reduce(
          (counts, item) => {
            const gender = item[key]?.trim().toLowerCase();
            if (gender && gender !== "null" && gender !== "unknown") {
              if (gender === "male" || gender === "boy" || gender === "man")
                counts.male += 1;
              if (
                gender === "female" ||
                gender === "girl" ||
                gender === "woman"
              )
                counts.female += 1;
            }
            return counts;
          },
          { male: 0, female: 0 }
        );

        genderData.push(
          { name: "Male", value: genderCounts.male },
          { name: "Female", value: genderCounts.female }
        );

        const total = `${
          genderCounts.male + genderCounts.female
        }/${totalQuestions}`;
        const breakdown = `Male: ${genderCounts.male}, Female: ${genderCounts.female}`;
        summary[key] = { total, breakdown };
      } else if (key === "ethnicity") {
        const ethnicityCounts = analyzedData.questions.reduce(
          (counts, item) => {
            const ethnicity = item[key]
              ?.replace(/-/g, " ")
              .trim()
              .toLowerCase();
            if (ethnicity && ethnicity !== "null" && ethnicity !== "unknown") {
              if (ethnicity === "african american")
                counts["African American"] += 1;
              else if (ethnicity === "asian" || ethnicity === "asian american")
                counts["Asian"] += 1;
              else if (ethnicity === "caucasian" || ethnicity === "white")
                counts["Caucasian"] += 1;
              else if (ethnicity === "hispanic") counts["Hispanic"] += 1;
              else counts["Other"] += 1;
            }
            return counts;
          },
          {
            "African American": 0,
            Asian: 0,
            Caucasian: 0,
            Hispanic: 0,
            Other: 0,
          }
        );

        Object.entries(ethnicityCounts).forEach(([key, value]) => {
          ethnicityData.push({ name: key, value });
        });

        const total =
          ethnicityCounts["African American"] +
          ethnicityCounts["Asian"] +
          ethnicityCounts["Caucasian"] +
          ethnicityCounts["Hispanic"] +
          ethnicityCounts["Other"];

        const breakdown = `African American: ${ethnicityCounts["African American"]}, Asian: ${ethnicityCounts["Asian"]}, Caucasian: ${ethnicityCounts["Caucasian"]}, Hispanic: ${ethnicityCounts["Hispanic"]}, Other: ${ethnicityCounts["Other"]}`;
        summary[key] = { total: `${total}/${totalQuestions}`, breakdown };
      } else {
        const nonNullCount = analyzedData.questions.filter(
          (item) => item[key] && item[key] !== "null" && item[key] !== "unknown"
        ).length;
        summary[key] = `${nonNullCount}/${totalQuestions}`;
      }
    });

    return { summary, genderData, ethnicityData };
  };

  const { summary, genderData, ethnicityData } = calculateSummary();

  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-md">
      {Object.keys(summary).length === 0 ? (
        <div className="text-center text-slate-500">
          No data available for analysis.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {Object.entries(summary).map(([key, value]) => (
            <div
              key={key}
              className="flex flex-col bg-slate-50 p-4 rounded-lg shadow-sm border border-slate-200"
            >
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-bold">{key}:</span>
                <span className="text-slate-800 font-bold">
                  {typeof value === "string" ? value : value.total}
                </span>
              </div>
              {typeof value === "object" && (
                <div className="text-sky-700 text-sm font-bold mt-2">
                  {value.breakdown}
                </div>
              )}
            </div>
          ))}
          <div className="grid grid-cols-2 gap-4">
            <PieChartComponent title="Gender Distribution" data={genderData} />
            <PieChartComponent
              title="Ethnicity Distribution"
              data={ethnicityData}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DataAnalysisSummary;
