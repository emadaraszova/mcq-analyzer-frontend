// --- Props for the response display component ---
export type ResponseProps = {
  jobId: string;
  onResponseReady: () => void;
  onResponse: (text: string, sessionId?: string) => void;
  onNote?: (note?: string) => void;
};

// --- Props for the chat header component ---
export type ChatHeaderProps = {
  model: string;
  prompt: string;
};

// --- API response when a generation job is triggered ---
export type TriggerResponse = { job_id: string; enqueued: boolean };

// --- Job status enums ---
export type JobRunning = { status: "queued" | "running" | "started" };
export type TaskResultStatus = "completed" | "partial";

// --- Result of a completed analysis/generation task ---
export type TaskResult = {
  status: TaskResultStatus;
  session_id: string;
  model: string;
  message: string;
  response: string;
  requested_number_of_questions?: number;
  actual_number_of_questions?: number;
  note?: string | null;
};

// --- Possible job states returned by backend ---
export type JobFinished = { status: "finished"; result: TaskResult };
export type JobFailed = { status: "failed"; error?: string | null };
export type JobStatusResponse = JobRunning | JobFinished | JobFailed;

// --- Request body for analysis trigger ---
export type TriggerBody = {
  message: string;
  model: string;
};

// --- Props for the model selection dropdown ---
export type AnalyzeDropdownButtonProps = {
  isResponseReady: boolean;
  onAnalyze: (model: string) => void;
  isPending: boolean;
  blockAnalyze?: boolean;
};
