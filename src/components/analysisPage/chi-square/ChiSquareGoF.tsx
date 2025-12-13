import { useMemo, useState } from "react";
import { computeChiSquare } from "@/hook/useChiSquare";
import {
  Issue,
  Row,
  ChiSquareGoFProps,
  DistributionPoint,
} from "@/types/analysisPage";
import DataEntryTable from "./DataEntryTable";
import ValidationMessages from "./ValidationMessage";
import QuickActionsBar from "./QuickActionBar";
import ResultSummary from "./ResultSummary";
import { Button } from "@/components/ui/button";

/** --- Initial empty dataset --- **/
const emptyRows: Row[] = [
  { label: "Category 1", observed: "", expected: "" },
  { label: "Category 2", observed: "", expected: "" },
];

/**
 * Observed counts:
 * - should be integers (true frequencies)
 * - UI blocks non-digits, but we keep this as a safe conversion layer
 */
const parseIntStrict = (v: unknown): number => {
  if (typeof v === "number") return Number.isInteger(v) ? v : NaN;
  if (typeof v !== "string") return NaN;

  const trimmed = v.trim();
  if (trimmed === "") return NaN;

  // Digits only (no decimals, no minus)
  if (!/^\d+$/.test(trimmed)) return NaN;

  return Number(trimmed);
};

/**
 * Expected counts:
 * - may be fractional (common in chi-square tests)
 * - allow comma or dot as decimal separator
 */
const parseDecimal = (v: unknown): number => {
  if (typeof v === "number") return v;
  if (typeof v !== "string") return NaN;

  const trimmed = v.trim();
  if (trimmed === "") return NaN;

  return Number(trimmed.replace(",", "."));
};

/** --- Chi-Square Goodness-of-Fit main component --- **/
const ChiSquareGoF = ({
  sexObservedFromCharts,
  ethnicityObservedFromCharts,
}: ChiSquareGoFProps) => {
  // --- Local state ---
  const [rows, setRows] = useState<Row[]>(emptyRows);
  const [alpha, setAlpha] = useState<number>(0.05);

  // --- Helper: fill observed from chart data ---
  const fillObservedFrom = (data?: DistributionPoint[]) => {
    if (!data || data.length === 0) return;

    setRows(
      data.map((d, idx) => ({
        label: d.name || `Category ${idx + 1}`,
        observed: d.value,
        expected: "",
      }))
    );
  };

  // --- Table row helpers ---
  const addRow = () =>
    setRows((r) => [
      ...r,
      { label: `Category ${r.length + 1}`, observed: "", expected: "" },
    ]);

  const removeRow = (i: number) =>
    setRows((r) => (r.length <= 2 ? r : r.filter((_, idx) => idx !== i)));

  const updateRow = (i: number, patch: Partial<Row>) =>
    setRows((r) =>
      r.map((row, idx) => (idx === i ? { ...row, ...patch } : row))
    );

  const reset = () => {
    setRows(emptyRows);
    setAlpha(0.05);
  };

  // --- Validation and data preparation ---
  const { issues, observed, expected } = useMemo(() => {
    const issues: Issue[] = [];
    const numericRows = rows
      .map((r) => ({
        label: r.label?.trim() || "",
        o: r.observed === "" ? NaN : parseIntStrict(r.observed),
        e: r.expected === "" ? NaN : parseDecimal(r.expected),
      }))
      .filter((x) => !(Number.isNaN(x.o) && Number.isNaN(x.e))); // skip blank lines

    // Basic structural checks
    if (numericRows.length < 2) {
      issues.push({ type: "error", text: "Provide at least two categories." });
    }

    // Observed values validation
    const observed = numericRows.map((r) => r.o);
    if (observed.some((o) => Number.isNaN(o))) {
      issues.push({
        type: "error",
        text: "All observed values must be non-negative integers.",
      });
    }
    if (observed.some((o) => o < 0)) {
      issues.push({ type: "error", text: "Observed values must be ≥ 0." });
    }
    const totalO = observed.reduce(
      (a, b) => a + (Number.isFinite(b) ? b : 0),
      0
    );
    if (totalO <= 0) {
      issues.push({ type: "error", text: "Total observed must be > 0." });
    }

    // Expected frequencies (allow fractional)
    const expected = numericRows.map((r) => r.e);
    if (expected.some((e) => Number.isNaN(e))) {
      issues.push({
        type: "error",
        text: "All expected values must be numbers.",
      });
    }
    if (expected.some((e) => e <= 0)) {
      issues.push({
        type: "error",
        text: "Expected frequencies must be > 0.",
      });
    }

    const totalE = expected.reduce(
      (a, b) => a + (Number.isFinite(b) ? b : 0),
      0
    );
    if (Math.abs(totalE - totalO) > 1e-9) {
      issues.push({
        type: "error",
        text: "Sum of expected frequencies must equal sum of observed.",
      });
    }

    // --- Warnings for small expected values ---
    if (expected.some((e) => e < 1)) {
      issues.push({
        type: "error",
        text: "Some expected counts are < 1 (test invalid).",
      });
    } else if (expected.some((e) => e < 5)) {
      issues.push({
        type: "warn",
        text: "Some expected counts are < 5 (approximation may be unreliable).",
      });
    }

    return { issues, observed, expected };
  }, [rows]);

  // --- Eligibility check ---
  const canCompute =
    issues.every((i) => i.type !== "error") && observed.length >= 2;

  // --- Compute result if valid ---
  const result = useMemo(() => {
    if (!canCompute) return null;
    try {
      return computeChiSquare(observed, expected);
    } catch {
      return null;
    }
  }, [canCompute, observed, expected]);

  // --- Effect sizes: Cohen's w and Total Variation Distance (TVD) ---
  const effectSizes = useMemo(() => {
    if (!canCompute || !result) return null;

    // N = total observed (for Cohen's w)
    const N = observed.reduce((s, o) => s + o, 0);

    // Cohen's w = sqrt(chi2 / N)
    const cohensW = N > 0 ? Math.sqrt(result.chi2 / N) : null;

    // TVD between observed and expected distributions:
    // TVD = 0.5 * sum_i | (O_i/N) - (E_i/N) |
    const tvd =
      N > 0
        ? 0.5 *
          observed.reduce((acc, o, i) => {
            const e = expected[i] ?? 0;
            return acc + Math.abs(o / N - e / N);
          }, 0)
        : null;

    return { cohensW, tvd };
  }, [canCompute, result, observed, expected]);

  // --- Quick actions ---
  const onEqualExpectation = () => {
    setRows((prev) => {
      const k = prev.length;

      // Total observed as integer sum (ignore invalid cells)
      const totalO = prev.reduce((sum, r) => {
        const o = r.observed === "" ? 0 : parseIntStrict(r.observed);
        return sum + (Number.isFinite(o) ? o : 0);
      }, 0);

      if (k <= 0 || totalO <= 0) {
        return prev.map((r) => ({ ...r, expected: "" }));
      }

      /**
       * Equal expectation:
       * - expected values can be fractional
       * - keep full precision here; rounding only in display layer
       */
      const each = totalO / k;

      return prev.map((r) => ({
        ...r,
        expected: String(Number(each.toFixed(6))),
      }));
    });
  };

  // --- UI layout ---
  return (
    <div className="space-y-4">
      {(sexObservedFromCharts?.length ||
        ethnicityObservedFromCharts?.length) && (
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
          <span>Fill observed counts from:</span>
          <Button
            size="sm"
            variant="outline"
            disabled={!sexObservedFromCharts?.length}
            onClick={() => fillObservedFrom(sexObservedFromCharts)}
          >
            Sex distribution
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={!ethnicityObservedFromCharts?.length}
            onClick={() => fillObservedFrom(ethnicityObservedFromCharts)}
          >
            Ethnicity distribution
          </Button>
        </div>
      )}

      <DataEntryTable
        rows={rows}
        onAddRow={addRow}
        onRemoveRow={removeRow}
        onChangeRow={updateRow}
      />

      <QuickActionsBar
        onEqualExpectation={onEqualExpectation}
        onReset={reset}
      />

      <ValidationMessages issues={issues} />

      <ResultSummary
        result={result}
        alpha={alpha}
        onAlphaChange={setAlpha}
        enabled={canCompute}
        effectSizes={effectSizes}
      />
    </div>
  );
};

export default ChiSquareGoF;
