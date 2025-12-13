import { useMemo, useState } from "react";
import { computeChiSquareHomogeneity } from "@/hook/useChiSquare";
import { HomogeneityRow, Issue } from "@/types/analysisPage";
import HomogeneityDataEntryTable from "./HomogeneityDataEntryTable";
import ValidationMessages from "./ValidationMessage";
import ResultSummary from "./ResultSummary";
import { Button } from "@/components/ui/button";

/** --- Initial empty R×C table (2 groups × 2 categories) --- **/
const initialColumnLabels = ["Category 1", "Category 2"];

const initialRows: HomogeneityRow[] = [
  { rowLabel: "Group 1", values: ["", ""] },
  { rowLabel: "Group 2", values: ["", ""] },
];

/** --- Chi-Square Homogeneity main component --- **/
const ChiSquareHomogeneity = () => {
  // --- Local state ---
  const [rows, setRows] = useState<HomogeneityRow[]>(initialRows);
  const [columnLabels, setColumnLabels] =
    useState<string[]>(initialColumnLabels);
  const [alpha, setAlpha] = useState<number>(0.05);

  // --- Table structure helpers ---
  const addRow = () =>
    setRows((prev) => [
      ...prev,
      {
        rowLabel: `Group ${prev.length + 1}`,
        values: columnLabels.map(() => ""),
      },
    ]);

  const removeRow = (rowIndex: number) =>
    setRows((prev) =>
      prev.length <= 2 ? prev : prev.filter((_, i) => i !== rowIndex)
    );

  const changeRowLabel = (rowIndex: number, label: string) =>
    setRows((prev) =>
      prev.map((row, i) => (i === rowIndex ? { ...row, rowLabel: label } : row))
    );

  const changeCell = (
    rowIndex: number,
    colIndex: number,
    value: string | number
  ) =>
    setRows((prev) =>
      prev.map((row, r) => {
        if (r !== rowIndex) return row;
        const values = [...row.values];
        values[colIndex] = value;
        return { ...row, values };
      })
    );

  const addColumn = () => {
    setColumnLabels((prev) => [...prev, `Category ${prev.length + 1}`]);
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        values: [...row.values, ""],
      }))
    );
  };

  const removeColumn = (colIndex: number) => {
    setColumnLabels((prev) =>
      prev.length <= 2 ? prev : prev.filter((_, i) => i !== colIndex)
    );
    setRows((prev) =>
      prev.map((row) => ({
        ...row,
        values:
          row.values.length <= 2
            ? row.values
            : row.values.filter((_, i) => i !== colIndex),
      }))
    );
  };

  const changeColumnLabel = (colIndex: number, label: string) =>
    setColumnLabels((prev) => prev.map((c, i) => (i === colIndex ? label : c)));

  const reset = () => {
    setRows(initialRows);
    setColumnLabels(initialColumnLabels);
    setAlpha(0.05);
  };

  // --- Validation and data preparation ---
  const { issues, observedTable } = useMemo(() => {
    const issues: Issue[] = [];

    const rowCount = rows.length;
    const colCount = columnLabels.length;

    const numericTable: number[][] = rows.map((row) =>
      columnLabels.map((_, j) => {
        const v = row.values[j];
        if (v === "" || v === null || v === undefined) return NaN;
        const num = Number(v);
        return Number.isFinite(num) ? num : NaN;
      })
    );

    // Structural checks
    if (rowCount < 2 || colCount < 2) {
      issues.push({
        type: "error",
        text: "Provide at least a 2×2 contingency table.",
      });
    }

    // Value checks
    const flat = numericTable.flat();
    if (flat.some((x) => Number.isNaN(x))) {
      issues.push({
        type: "error",
        text: "All cells must be numbers.",
      });
    }
    if (flat.some((x) => x < 0)) {
      issues.push({
        type: "error",
        text: "All counts must be ≥ 0.",
      });
    }

    // Totals
    const rowTotals = numericTable.map((row) =>
      row.reduce((s, x) => s + (Number.isFinite(x) ? x : 0), 0)
    );
    const grandTotal = rowTotals.reduce((s, t) => s + t, 0);

    if (grandTotal <= 0) {
      issues.push({
        type: "error",
        text: "Total count must be > 0.",
      });
    }

    if (rowTotals.some((t) => t <= 0)) {
      issues.push({
        type: "error",
        text: "Each group (row) must have total count > 0.",
      });
    }

    // Only attempt expected counts + small-count checks if no hard errors
    if (
      !issues.some((i) => i.type === "error") &&
      rowCount >= 2 &&
      colCount >= 2
    ) {
      const colTotals = Array.from({ length: colCount }, (_, j) =>
        numericTable.reduce(
          (s, row) => s + (Number.isFinite(row[j]) ? row[j] : 0),
          0
        )
      );

      if (grandTotal > 0) {
        const expectedTable: number[][] = numericTable.map((row, i) =>
          row.map((_, j) => (rowTotals[i] * colTotals[j]) / grandTotal)
        );

        const flatExpected = expectedTable.flat();

        if (flatExpected.some((e) => e < 1)) {
          issues.push({
            type: "error",
            text: "Some expected counts are < 1 (test invalid).",
          });
        } else if (flatExpected.some((e) => e < 5)) {
          issues.push({
            type: "warn",
            text: "Some expected counts are < 5 (approximation may be unreliable).",
          });
        }
      }
    }

    return {
      issues,
      observedTable:
        !issues.some((i) => i.type === "error") &&
        rowCount >= 2 &&
        colCount >= 2
          ? numericTable
          : [],
    };
  }, [rows, columnLabels]);

  // --- Eligibility check ---
  const canCompute =
    issues.every((i) => i.type !== "error") &&
    observedTable.length >= 2 &&
    (observedTable[0]?.length ?? 0) >= 2;

  // --- Compute result if valid ---
  const result = useMemo(() => {
    if (!canCompute) return null;
    try {
      return computeChiSquareHomogeneity(observedTable);
    } catch {
      return null;
    }
  }, [canCompute, observedTable]);

  // --- Effect sizes (Homogeneity): Cramér’s V + TVD (between-group) ---
  const effectSizes = useMemo(() => {
    if (!canCompute || !result) return null;

    const r = observedTable.length; // groups
    const c = observedTable[0]?.length ?? 0; // categories

    // N = grand total
    const N = observedTable.reduce(
      (s, row) =>
        s + row.reduce((ss, x) => ss + (Number.isFinite(x) ? x : 0), 0),
      0
    );

    // Cramér’s V: sqrt( chi2 / ( N * min(r-1, c-1) ) )
    const denom = N * Math.min(r - 1, c - 1);
    const cramerV = denom > 0 ? Math.sqrt(result.chi2 / denom) : null;
    // Total Variation Distance (TVD) between groups
    const rowTotals = observedTable.map((row) =>
      row.reduce((s, x) => s + (Number.isFinite(x) ? x : 0), 0)
    );

    const rowDists = observedTable.map((row, i) => {
      const tot = rowTotals[i] ?? 0;
      return row.map((x) => (tot > 0 && Number.isFinite(x) ? x / tot : 0));
    });

    const tvdBetween = (a: number[], b: number[]) =>
      0.5 * a.reduce((acc, aj, j) => acc + Math.abs(aj - (b[j] ?? 0)), 0);

    let tvd: number | null = null;
    if (rowDists.length >= 2) {
      let max = 0;
      for (let i = 0; i < rowDists.length; i++) {
        for (let k = i + 1; k < rowDists.length; k++) {
          max = Math.max(max, tvdBetween(rowDists[i], rowDists[k]));
        }
      }
      tvd = max;
    }

    return { cramerV, tvd };
  }, [canCompute, result, observedTable]);

  // --- UI layout ---
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Enter counts in a contingency table where rows represent groups and
        columns represent outcome categories.
      </p>

      <HomogeneityDataEntryTable
        rows={rows}
        columnLabels={columnLabels}
        onChangeRowLabel={changeRowLabel}
        onChangeCell={changeCell}
        onChangeColumnLabel={changeColumnLabel}
        onAddRow={addRow}
        onRemoveRow={removeRow}
        onAddColumn={addColumn}
        onRemoveColumn={removeColumn}
      />

      <Button variant="secondary" onClick={reset}>
        Reset table
      </Button>

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

export default ChiSquareHomogeneity;
