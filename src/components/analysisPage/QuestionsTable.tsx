// components/analysisPage/QuestionsTable.tsx

import { useMemo } from "react";
import { normalizeQuestions } from "@/utils/clinicalNormalization";
import { QuestionsTableProps } from "@/types/analysisPage";

/** --- Displays extracted questions in a normalized table view --- **/
const QuestionsTable = ({
  questions,
  ethnicityConfig,
}: QuestionsTableProps) => {
  // Precompute normalized rows whenever questions / config change
  const rows = useMemo(
    () => normalizeQuestions(questions, ethnicityConfig),
    [questions, ethnicityConfig]
  );

  // Guard: no rows to display
  if (!rows.length) {
    return (
      <div className="text-center text-slate-500 text-sm">
        No extracted questions available.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm bg-white border border-slate-200 rounded-lg">
        <thead className="bg-slate-100">
          <tr>
            <th className="px-3 py-2 border border-slate-200 text-left">#</th>
            <th className="px-3 py-2 border border-slate-200 text-left">
              Raw Sex
            </th>
            <th className="px-3 py-2 border border-slate-200 text-left">
              Sex Category
            </th>
            <th className="px-3 py-2 border border-slate-200 text-left">
              Raw Ethnicity
            </th>
            <th className="px-3 py-2 border border-slate-200 text-left">
              Ethnicity Category
            </th>
            <th className="px-3 py-2 border border-slate-200 text-left">Age</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.index} className="odd:bg-slate-50">
              {/* Question index */}
              <td className="px-3 py-2 border border-slate-200 text-center font-semibold">
                {row.index}
              </td>

              {/* Raw sex as extracted from the scenario */}
              <td className="px-3 py-2 border border-slate-200">
                {row.rawSex ?? "—"}
              </td>

              {/* Normalized sex (Male / Female) used in analysis */}
              <td className="px-3 py-2 border border-slate-200 font-medium">
                {row.normalizedSex ?? "—"}
              </td>

              {/* Raw ethnicity string */}
              <td className="px-3 py-2 border border-slate-200">
                {row.rawEthnicity ?? "—"}
              </td>

              {/* Mapped ethnicity category (e.g. Black, Hispanic, Other) */}
              <td className="px-3 py-2 border border-slate-200 font-medium">
                {row.ethnicityCategory ?? "—"}
              </td>

              {/* Age as number (if parsable) */}
              <td className="px-3 py-2 border border-slate-200">
                {row.age ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default QuestionsTable;
