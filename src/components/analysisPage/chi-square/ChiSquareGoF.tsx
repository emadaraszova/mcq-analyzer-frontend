import { useMemo, useState } from "react";
import { computeChiSquare } from "@/hook/useChiSquare";
import { EntryMode, Issue, Row } from "@/types/analysisPage";
import EntryModeSelector from "./EntryModeSelector";
import DataEntryTable from "./DataEntryTable";
import ValidationMessages from "./ValidationMessage";
import QuickActionsBar from "./QuickActionBar";
import ResultSummary from "./ResultSummary";

/** --- Initial empty dataset --- **/
const emptyRows: Row[] = [
  { label: "Category 1", observed: "", expected: "" },
  { label: "Category 2", observed: "", expected: "" },
];

/** --- Chi-Square Goodness-of-Fit main component --- **/
const ChiSquareGoF = () => {
  // --- Local state ---
  const [entryMode, setEntryMode] = useState<EntryMode>("expected-freq");
  const [rows, setRows] = useState<Row[]>(emptyRows);
  const [alpha, setAlpha] = useState<number>(0.05);

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
    setEntryMode("expected-freq");
    setAlpha(0.05);
  };

  // --- Validation and data preparation ---
  const { issues, observed, expected } = useMemo(() => {
    const issues: Issue[] = [];
    const numericRows = rows
      .map((r) => ({
        label: r.label?.trim() || "",
        o: r.observed === "" ? NaN : Number(r.observed),
        e: r.expected === "" ? NaN : Number(r.expected),
      }))
      .filter((x) => !(Number.isNaN(x.o) && Number.isNaN(x.e))); // skip blank lines

    // Basic structural checks
    if (numericRows.length < 2)
      issues.push({ type: "error", text: "Provide at least two categories." });

    // Observed values validation
    const observed = numericRows.map((r) => r.o);
    if (observed.some((o) => Number.isNaN(o)))
      issues.push({
        type: "error",
        text: "All observed values must be numbers.",
      });
    if (observed.some((o) => o < 0))
      issues.push({ type: "error", text: "Observed values must be ≥ 0." });
    const totalO = observed.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
    if (totalO <= 0)
      issues.push({ type: "error", text: "Total observed must be > 0." });

    // Expected values or probabilities
    let expected: number[] = [];
    if (entryMode === "expected-freq") {
      expected = numericRows.map((r) => r.e);
      if (expected.some((e) => Number.isNaN(e)))
        issues.push({
          type: "error",
          text: "All expected values must be numbers.",
        });
      if (expected.some((e) => e <= 0))
        issues.push({
          type: "error",
          text: "Expected frequencies must be > 0.",
        });

      const totalE = expected.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
      if (Math.abs(totalE - totalO) > 1e-9) {
        issues.push({
          type: "error",
          text: "Sum of expected frequencies must equal sum of observed.",
        });
      }
    } else {
      // --- Probabilities mode ---
      const probs = numericRows.map((r) => r.e);
      if (probs.some((p) => Number.isNaN(p)))
        issues.push({
          type: "error",
          text: "All expected probabilities must be numbers.",
        });
      if (probs.some((p) => p <= 0))
        issues.push({
          type: "error",
          text: "Expected probabilities must be > 0.",
        });

      const sumP = probs.reduce((a, b) => a + (isFinite(b) ? b : 0), 0);
      if (Math.abs(sumP - 1) > 1e-9) {
        issues.push({
          type: "error",
          text: "Expected probabilities must sum to 1. Use Normalize to fix rounding.",
        });
      }
      expected = probs.map((p) => p * totalO);
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
  }, [rows, entryMode]);

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

  // --- Quick actions ---
  const onEqualExpectation = () => {
    setRows((prev) => {
      const k = prev.length;
      if (entryMode === "expected-freq") {
        const totalO = prev.reduce(
          (sum, r) => sum + (Number(r.observed) || 0),
          0
        );
        const each = k > 0 ? totalO / k : 0;
        return prev.map((r) => ({
          ...r,
          expected: each === 0 ? "" : Number(each.toFixed(6)),
        }));
      } else {
        const each = k > 0 ? 1 / k : 0;
        return prev.map((r) => ({
          ...r,
          expected: each === 0 ? "" : Number(each.toFixed(6)),
        }));
      }
    });
  };

  const onNormalizeProbabilities = () => {
    if (entryMode !== "expected-prob") return;
    setRows((prev) => {
      const sum = prev.reduce((s, r) => s + (Number(r.expected) || 0), 0);
      if (sum <= 0) return prev;
      return prev.map((r) => ({
        ...r,
        expected: Number(((Number(r.expected) || 0) / sum).toFixed(12)),
      }));
    });
  };

  // --- UI layout ---
  return (
    <div className="space-y-4">
      <EntryModeSelector value={entryMode} onChange={setEntryMode} />
      <DataEntryTable
        rows={rows}
        entryMode={entryMode}
        onAddRow={addRow}
        onRemoveRow={removeRow}
        onChangeRow={updateRow}
      />

      <QuickActionsBar
        onEqualExpectation={onEqualExpectation}
        onNormalizeProbabilities={onNormalizeProbabilities}
        onReset={reset}
        entryMode={entryMode}
      />

      <ValidationMessages issues={issues} />

      <ResultSummary
        result={result}
        alpha={alpha}
        onAlphaChange={setAlpha}
        enabled={canCompute}
      />
    </div>
  );
};

export default ChiSquareGoF;
