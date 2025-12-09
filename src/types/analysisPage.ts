// --- Analysis result structures from backend ---
export type ClinicalAnalysisItem = {
  sex: string | null;
  ethnicity: string | null;
  age: number | null | string;
};

export type ClinicalAnalysisResult = {
  questions: ClinicalAnalysisItem[];
};

// --- Props for analysis-related components ---
export type DataAnalysisSummaryProps = {
  analyzedData: ClinicalAnalysisResult;
  ethnicityConfig: EthnicityCategoryConfig[];
  onEthnicityConfigChange: (config: EthnicityCategoryConfig[]) => void;
  onSexDistributionChange?: (data: DistributionPoint[]) => void;
  onEthnicityDistributionChange?: (data: DistributionPoint[]) => void;
};

export type PieChartComponentProps = {
  title: string;
  data: { name: string; value: number }[];
};

export type AgeHistogramProps = {
  ageData: number[];
};

// --- Response types for trigger and job status ---
export type TriggerResponse = { job_id: string; enqueued: boolean };

export type JobRunning = { status: "queued" | "running" | "started" };
export type TaskResultStatus = "completed" | "partial";

export type JobFinished = {
  status: "finished";
  result: ClinicalAnalysisResult;
};

export type JobFailed = { status: "failed"; error?: string | null };

// --- Union of all possible job states ---
export type JobStatusResponse = JobRunning | JobFinished | JobFailed;

// --- Request body for triggering analysis ---
export type TriggerBody = {
  message: string;
  model: string;
};

// --- Chi-Square Goodness-of-Fit related types ---
export type EntryMode = "expected-freq" | "expected-prob";

export type EntryModeSelectorProps = {
  value: EntryMode;
  onChange: (mode: EntryMode) => void;
};

export type Row = {
  label: string;
  observed: number | "";
  expected: number | "";
};

export type ChiSquareGoFProps = {
  sexObservedFromCharts?: DistributionPoint[];
  ethnicityObservedFromCharts?: DistributionPoint[];
};

export type DataEntryTableProps = {
  rows: Row[];
  entryMode: EntryMode;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onChangeRow: (index: number, patch: Partial<Row>) => void;
};

export type QuickActionsBarProps = {
  onEqualExpectation: () => void;
  onNormalizeProbabilities: () => void;
  onReset: () => void;
  entryMode: EntryMode;
};

export type Issue = { type: "error" | "warn"; text: string };

export type ValidationMessagesProps = {
  issues: Issue[];
};

// --- Statistical test result types ---
export type Result = { chi2: number; df: number; pValue: number } | null;

export type ResultSummaryProps = {
  result: Result;
  alpha: number;
  onAlphaChange: (a: number) => void;
  enabled: boolean;
};

// --- Homogeneity table row ---
export type HomogeneityRow = {
  rowLabel: string;
  values: (string | number)[];
};

// --- Homogeneity data entry props ---
export interface HomogeneityDataEntryTableProps {
  rows: HomogeneityRow[];
  columnLabels: string[];
  onChangeRowLabel: (rowIndex: number, label: string) => void;
  onChangeCell: (
    rowIndex: number,
    colIndex: number,
    value: string | number
  ) => void;
  onChangeColumnLabel: (colIndex: number, label: string) => void;
  onAddRow: () => void;
  onRemoveRow: (rowIndex: number) => void;
  onAddColumn: () => void;
  onRemoveColumn: (colIndex: number) => void;
}

// --- Ethnicity configuration types ---
export type EthnicityCategoryConfig = {
  id: string;
  label: string;
  matchers: string[];
  isFallback?: boolean;
};

export type EthnicityConfigCardProps = {
  config: EthnicityCategoryConfig[];
  onChange: (next: EthnicityCategoryConfig[]) => void;
};

// Shape of one normalized row used for table
export type NormalizedRow = {
  index: number;
  rawSex: string | null;
  normalizedSex: "Male" | "Female" | null;
  rawEthnicity: string | null;
  ethnicityCategory: string | null;
  age: number | null;
};

// Props for the normalized questions table
export type QuestionsTableProps = {
  questions: ClinicalAnalysisItem[];
  ethnicityConfig: EthnicityCategoryConfig[];
};

export type DistributionPoint = {
  name: string; // label used in charts
  value: number; // count
};
