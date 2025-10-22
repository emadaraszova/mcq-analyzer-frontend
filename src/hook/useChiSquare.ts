import { jStat } from 'jstat';

export function computeChiSquare(observed: number[], expected: number[]) {
  if (observed.length !== expected.length) {
    throw new Error("Observed and expected arrays must have the same length.");
  }
  const k = observed.length;
  const chi2 = observed.reduce((sum, o, i) => sum + ((o - expected[i]) ** 2) / expected[i], 0);
  const df = Math.max(1, k - 1);
  const pValue = 1 - jStat.chisquare.cdf(chi2, df);  
  return { chi2, df, pValue };
}
