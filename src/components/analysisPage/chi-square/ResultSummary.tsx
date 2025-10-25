import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Label from "@/components/common/Label";
import { ResultSummaryProps } from "@/types/analysisPage";

/** --- Displays chi-square test results and significance decision --- **/
const ResultSummary = ({
  result,
  alpha,
  onAlphaChange,
  enabled,
}: ResultSummaryProps) => {
  // Local text state so users can clear/type without forcing NaN
  const [alphaText, setAlphaText] = useState<string>(String(alpha));

  // Keep local text in sync if parent alpha changes elsewhere
  useEffect(() => {
    setAlphaText(String(alpha));
  }, [alpha]);

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setAlphaText(v); // always update the textbox
    const n = Number(v);
    if (!Number.isNaN(n)) {
      onAlphaChange(n); // only push up when valid
    }
  };

  // Optional: snap back on blur if invalid text remains
  const handleBlur = () => {
    const n = Number(alphaText);
    if (Number.isNaN(n)) setAlphaText(String(alpha));
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Alpha input field */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="alpha" text="Significance (α)" />
          <Input
            id="alpha"
            className="w-24"
            inputMode="decimal"
            value={alphaText}
            onChange={handleAlphaChange}
            onBlur={handleBlur}
            placeholder="0.05"
          />
        </div>

        {!enabled && (
          <p className="text-sm text-slate-500">
            Enter valid values to compute the test.
          </p>
        )}
      </div>

      {enabled && result && (
        <div className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-blue-50 rounded-md p-3">
              <div className="text-sm text-slate-600">χ² statistic</div>
              <div className="text-xl font-semibold">
                {result.chi2.toFixed(4)}
              </div>
            </div>
            <div className="bg-blue-50 rounded-md p-3">
              <div className="text-sm text-slate-600">Degrees of freedom</div>
              <div className="text-xl font-semibold">{result.df}</div>
            </div>
            <div className="bg-blue-50 rounded-md p-3">
              <div className="text-sm text-slate-600">p-value</div>
              <div className="text-xl font-semibold">
                {result.pValue.toFixed(4)}
              </div>
            </div>
          </div>

          <div className="mt-3 text-xl">
            Decision at α = <b>{alpha}</b>:
            {result.pValue < alpha ? (
              <span className="ml-1 font-semibold text-red-700">Reject H₀</span>
            ) : (
              <span className="ml-1 font-semibold text-green-700">
                Fail to reject H₀
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Each expected count should be ≥ 5 for the chi-square approximation
            to be reliable.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultSummary;
