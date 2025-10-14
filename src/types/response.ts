export type ResponseProps = {
  jobId: string;
  onResponseReady: () => void;
  onResponse: (text: string, sessionId?: string) => void;
};


export type ChatHeaderProps = {
  model: string;
  prompt: string;
}

// Frontend payload 
export type TriggerBody = {
  prompt: string;
  model: string;
  numQuestions?: number;
};

// What the trigger endpoint returns
export type TriggerResponse = { job_id: string; enqueued: boolean };

// Job status enums
export type JobRunning = { status: "queued" | "running" | "started" };

export type TaskResultStatus = "completed" | "partial";

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

export type JobFinished = { status: "finished"; result: TaskResult };
export type JobFailed = { status: "failed"; error?: string | null };

// Union returned by GET /status/{job_id}
export type JobStatusResponse = JobRunning | JobFinished | JobFailed;