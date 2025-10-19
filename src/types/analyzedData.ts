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
