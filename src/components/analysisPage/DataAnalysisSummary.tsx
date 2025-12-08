import {
  ClinicalAnalysisItem,
  DataAnalysisSummaryProps,
} from "@/types/analysisPage";
import PieChartComponent from "./PieChart";
import AgeHistogram from "./AgeHistogram";
import EthnicityConfigCard from "./EthnicityConfigCard";
import { useMemo } from "react";
import {
  normalizeSex,
  resolveEthnicityCategory,
} from "@/utils/clinicalNormalization";

/** --- Displays summarized analysis data with charts --- **/
const DataAnalysisSummary = ({
  analyzedData,
  ethnicityConfig,
  onEthnicityConfigChange,
}: DataAnalysisSummaryProps) => {
  // --- Compute summary statistics (depends on ethnicityConfig) ---
  const { summary, sexData, ethnicityData, ageData } = useMemo(() => {
    if (
      !analyzedData ||
      !Array.isArray(analyzedData.questions) ||
      analyzedData.questions.length === 0
    ) {
      console.warn("No analyzed data provided or questions array is invalid.");
      return {
        summary: {},
        sexData: [],
        ethnicityData: [],
        ageData: [] as number[],
      };
    }

    const totalQuestions = analyzedData.questions.length;
    const keys = Object.keys(
      analyzedData.questions[0]
    ) as (keyof ClinicalAnalysisItem)[];

    const summary: Record<
      string,
      string | { total: string; breakdown: string }
    > = {};
    const sexData: { name: string; value: number }[] = [];
    const ethnicityCounts: Record<string, number> = {};
    const ageValues: number[] = [];

    // --- Process each key in question data ---
    keys.forEach((key) => {
      if (key === "sex") {
        const sexCounts = analyzedData.questions.reduce(
          (counts, item) => {
            const normalized = normalizeSex(item[key] ?? null);
            if (normalized === "Male") counts.male += 1;
            else if (normalized === "Female") counts.female += 1;
            return counts;
          },
          { male: 0, female: 0 }
        );

        sexData.push(
          { name: "Male", value: sexCounts.male },
          { name: "Female", value: sexCounts.female }
        );

        summary[key] = {
          total: `${sexCounts.male + sexCounts.female}/${totalQuestions}`,
          breakdown: `Male: ${sexCounts.male}, Female: ${sexCounts.female}`,
        };
      } else if (key === "ethnicity") {
        analyzedData.questions.forEach((item) => {
          const rawEth = item[key];
          if (!rawEth) return;

          const categoryLabel = resolveEthnicityCategory(
            String(rawEth),
            ethnicityConfig
          );
          if (!categoryLabel) return;

          ethnicityCounts[categoryLabel] =
            (ethnicityCounts[categoryLabel] || 0) + 1;
        });

        const total = Object.values(ethnicityCounts).reduce((a, b) => a + b, 0);
        const breakdown = Object.entries(ethnicityCounts)
          .map(([eth, count]) => `${eth}: ${count}`)
          .join(", ");

        summary[key] = { total: `${total}/${totalQuestions}`, breakdown };
      } else if (key === "age") {
        analyzedData.questions.forEach((item) => {
          const age = item[key];
          if (
            age &&
            typeof age !== "number" &&
            age !== "null" &&
            age !== "unknown"
          ) {
            ageValues.push(parseInt(age as any, 10));
          } else if (typeof age === "number") {
            ageValues.push(age);
          }
        });

        if (ageValues.length > 0) {
          const meanAge =
            ageValues.reduce((a, b) => a + b, 0) / ageValues.length;
          const medianAge = ageValues.sort((a, b) => a - b)[
            Math.floor(ageValues.length / 2)
          ];
          summary[key] = {
            total: `${ageValues.length}/${totalQuestions}`,
            breakdown: `Mean: ${meanAge.toFixed(2)}, Median: ${medianAge}`,
          };
        } else {
          summary[key] = "No valid data";
        }
      } else {
        const nonNullCount = analyzedData.questions.filter(
          (item) => item[key] && item[key] !== "null" && item[key] !== "unknown"
        ).length;
        summary[key] = `${nonNullCount}/${totalQuestions}`;
      }
    });

    const ethnicityData = ethnicityConfig.map((cat) => ({
      name: cat.label,
      value: ethnicityCounts[cat.label] || 0,
    }));

    return { summary, sexData, ethnicityData, ageData: ageValues };
  }, [analyzedData, ethnicityConfig]);

  // --- Render analysis summary + charts ---
  return (
    <div className="bg-slate-50 p-6 rounded-lg shadow-md space-y-4">
      {Object.keys(summary).length === 0 ? (
        <div className="text-center text-slate-500">
          No data available for analysis.
        </div>
      ) : (
        <>
          {/* Ethnicity categories config – now controlled by parent */}
          <EthnicityConfigCard
            config={ethnicityConfig}
            onChange={onEthnicityConfigChange}
          />

          <div className="grid grid-cols-1 gap-2">
            {Object.entries(summary).map(([key, value]) => (
              <div
                key={key}
                className="flex flex-col bg-slate-50 p-3 rounded-lg shadow-sm border border-slate-200"
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
              <PieChartComponent title="Sex Distribution" data={sexData} />
              <PieChartComponent
                title="Ethnicity Distribution"
                data={ethnicityData}
              />
            </div>

            <AgeHistogram ageData={ageData} />
          </div>
        </>
      )}
    </div>
  );
};

export default DataAnalysisSummary;
