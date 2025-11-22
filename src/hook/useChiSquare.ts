// src/hook/useChiSquare.ts
import { jStat } from "jstat";

/** --- Compute Chi-Square statistic, degrees of freedom, and p-value --- **/
export function computeChiSquare(observed: number[], expected: number[]) {
  // --- Validate input lengths ---
  if (observed.length !== expected.length) {
    throw new Error("Observed and expected arrays must have the same length.");
  }

  const k = observed.length;

  // --- Compute chi-square statistic ---
  const chi2 = observed.reduce(
    (sum, o, i) => sum + (o - expected[i]) ** 2 / expected[i],
    0
  );

  // --- Degrees of freedom (minimum 1) ---
  const df = Math.max(1, k - 1);

  // --- p-value from chi-square CDF ---
  const pValue = 1 - jStat.chisquare.cdf(chi2, df);

  return { chi2, df, pValue };
}

/** --- Chi-Square test of homogeneity for an R×C table --- **/
export function computeChiSquareHomogeneity(observedTable: number[][]) {
  const rows = observedTable.length;
  const cols = observedTable[0]?.length ?? 0;

  if (rows < 2 || cols < 2) {
    throw new Error("Table must have at least 2 rows and 2 columns.");
  }

  // --- Row totals, column totals, grand total ---
  const rowTotals = observedTable.map((row) =>
    row.reduce((s, v) => s + (isFinite(v) ? v : 0), 0)
  );

  const colTotals = Array.from({ length: cols }, (_, j) =>
    observedTable.reduce((s, row) => s + (isFinite(row[j]) ? row[j] : 0), 0)
  );

  const grandTotal = rowTotals.reduce((a, b) => a + b, 0);
  if (grandTotal <= 0) {
    throw new Error("Grand total must be > 0.");
  }

  // --- Expected counts and chi-square statistic ---
  let chi2 = 0;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const expected = (rowTotals[i] * colTotals[j]) / grandTotal;
      if (expected <= 0) {
        throw new Error("All expected counts must be > 0.");
      }
      const o = observedTable[i][j];
      chi2 += (o - expected) ** 2 / expected;
    }
  }

  // --- Degrees of freedom ---
  const df = Math.max(1, (rows - 1) * (cols - 1));

  // --- p-value from chi-square CDF ---
  const pValue = 1 - jStat.chisquare.cdf(chi2, df);

  return { chi2, df, pValue };
}
