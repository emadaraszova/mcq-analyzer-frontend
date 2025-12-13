import { Input } from "@/components/ui/input";
import { ResultSummaryProps } from "@/types/analysisPage";

/** --- Shared summary for chi-square tests (GoF + Homogeneity) --- **/
const ResultSummary = ({
  result,
  alpha,
  onAlphaChange,
  enabled,
  effectSizes,
}: ResultSummaryProps) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Alpha control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-slate-700">
            Significance (α)
          </div>
          <p className="text-xs text-slate-500">
            Used to decide whether to reject the null hypothesis.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            className="w-24"
            value={alpha}
            onChange={(e) => onAlphaChange(Number(e.target.value))}
            inputMode="decimal"
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
          {/* Main test results */}
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

          {/* Effect sizes (optional) */}
          {(effectSizes?.cohensW != null ||
            effectSizes?.cramerV != null ||
            effectSizes?.tvd != null) && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
              {effectSizes?.cohensW != null && (
                <div className="bg-slate-50 rounded-md p-3">
                  <div className="text-sm text-slate-600">Cohen&apos;s w</div>
                  <div className="text-xl font-semibold">
                    {effectSizes.cohensW.toFixed(4)}
                  </div>
                </div>
              )}

              {effectSizes?.cramerV != null && (
                <div className="bg-slate-50 rounded-md p-3">
                  <div className="text-sm text-slate-600">Cramér&apos;s V</div>
                  <div className="text-xl font-semibold">
                    {effectSizes.cramerV.toFixed(4)}
                  </div>
                </div>
              )}

              {effectSizes?.tvd != null && (
                <div className="bg-slate-50 rounded-md p-3">
                  <div className="text-sm text-slate-600">
                    Total Variation Distance (TVD)
                  </div>
                  <div className="text-xl font-semibold">
                    {effectSizes.tvd.toFixed(4)}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Decision */}
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
