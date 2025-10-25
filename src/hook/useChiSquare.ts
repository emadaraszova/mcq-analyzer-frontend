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
