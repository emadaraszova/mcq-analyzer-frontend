import { Input } from "@/components/ui/input";
import Label from "@/components/common/Label"; 
import { ResultSummaryProps } from "@/types/analysisPage";


const ResultSummary = ({
  result,
  alpha,
  onAlphaChange,
  enabled,
}: ResultSummaryProps) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="alpha" text="Significance (α)" />
          <Input
            id="alpha"
            className="w-24"
            inputMode="decimal"
            value={alpha}
            onChange={(e) => onAlphaChange(Number(e.target.value))}
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
           Each expected count should be ≥ 5 for the chi-square
            approximation to be reliable.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultSummary;