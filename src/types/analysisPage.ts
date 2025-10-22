// Analysis result payload coming from BE when finished
export type ClinicalAnalysisItem = {
  gender: string | null;
  ethnicity: string | null;
  age: number | null | string;
};

export type ClinicalAnalysisResult = {
  questions: ClinicalAnalysisItem[];
};

export type DataAnalysisSummaryProps = {
  analyzedData: ClinicalAnalysisResult;
}

export type PieChartComponentProps ={
  title: string;
  data: { name: string; value: number }[];
}

export type AgeHistogramProps = {
  ageData: number[];
}

// What the trigger endpoint returns
export type TriggerResponse = { job_id: string; enqueued: boolean };

// Job status enums
export type JobRunning = { status: "queued" | "running" | "started" };

export type TaskResultStatus = "completed" | "partial";


export type JobFinished = { status: "finished"; result: ClinicalAnalysisResult };
export type JobFailed = { status: "failed"; error?: string | null };

// Union returned by GET /status/{job_id}
export type JobStatusResponse = JobRunning | JobFinished | JobFailed;


export type TriggerBody = {
  message: string;
  model: string; 
}

export type EntryMode = "expected-freq" | "expected-prob";

export type EntryModeSelectorProps = {
  value: EntryMode;
  onChange: (mode: EntryMode) => void;
}

export type Row = {
  label: string;
  observed: number | "";
  expected: number | ""; 
}

export type DataEntryTableProps = {
  rows: Row[];
  entryMode: EntryMode;
  onAddRow: () => void;
  onRemoveRow: (index: number) => void;
  onChangeRow: (index: number, patch: Partial<Row>) => void;
}

export type QuickActionsBarProps = {
  onEqualExpectation: () => void;
  onNormalizeProbabilities: () => void;
  onReset: () => void;
  entryMode: EntryMode;
}


export type Issue = { type: "error" | "warn"; text: string };

export type ValidationMessagesProps = {
  issues: Issue[];
}

export type Result = { chi2: number; df: number; pValue: number } | null;

export type ResultSummaryProps = {
  result: Result;
  alpha: number;
  onAlphaChange: (a: number) => void;
  enabled: boolean;
}