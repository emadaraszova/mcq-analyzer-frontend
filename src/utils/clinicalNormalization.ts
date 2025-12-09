// utils/clinicalNormalization.ts

import {
  ClinicalAnalysisItem,
  EthnicityCategoryConfig,
  NormalizedRow,
} from "@/types/analysisPage";


/** --- Normalize free-text sex / gender into Male / Female --- **/
export const normalizeSex = (raw?: string | null) => {
  if (!raw) return null;

  const sex = raw.trim().toLowerCase();

  // Map common variants to "Male"
  if (["male", "boy", "man", "trans man", "transsex man"].includes(sex))
    return "Male" as const;

  // Map common variants to "Female"
  if (
    ["female", "girl", "woman", "trans woman", "transsex woman"].includes(sex)
  )
    return "Female" as const;

  // Unknown / unsupported values
  return null;
};

/** --- Map a raw ethnicity string to one of the configured categories --- **/
export const resolveEthnicityCategory = (
  raw: string | null | undefined,
  ethnicityConfig: EthnicityCategoryConfig[]
): string | null => {
  if (!raw) return null;

  const normalized = raw.replace(/-/g, " ").trim().toLowerCase();

  // Treat empty / null-like values as missing
  if (!normalized || normalized === "null" || normalized === "unknown") {
    return null;
  }

  // Try to match any configured keyword as substring
  for (const cat of ethnicityConfig) {
    const matchers = cat.matchers
      .map((m) => m.toLowerCase().trim())
      .filter(Boolean);

    if (matchers.length === 0) continue;

    if (matchers.some((m) => normalized.includes(m))) {
      return cat.label || "Other";
    }
  }

  // Fallback: category marked as isFallback, if present
  const fallbackCat = ethnicityConfig.find((c) => c.isFallback);
  return fallbackCat ? fallbackCat.label : "Other";
};

/** --- Build a normalized view over all extracted questions --- **/
export const normalizeQuestions = (
  questions: ClinicalAnalysisItem[],
  ethnicityConfig: EthnicityCategoryConfig[]
): NormalizedRow[] =>
  questions.map((q, i) => ({
    index: i + 1,
    // sex / gender
    rawSex: (q as any).sex ?? null,
    normalizedSex: normalizeSex((q as any).sex ?? null),

    // ethnicity
    rawEthnicity: (q as any).ethnicity ?? null,
    ethnicityCategory: resolveEthnicityCategory(
      (q as any).ethnicity ?? null,
      ethnicityConfig
    ),

    // age - always try to store as number
    age:
      typeof q.age === "number"
        ? q.age
        : q.age
        ? parseInt(q.age as any, 10)
        : null,
  }));
