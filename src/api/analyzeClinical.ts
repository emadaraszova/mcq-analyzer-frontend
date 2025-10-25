import {
  JobStatusResponse,
  TriggerBody,
  TriggerResponse,
} from "@/types/analysisPage";

const API_BASE = "http://localhost:8000/api/analyze-clinical";

/**
 * Ensures a fetch Response is OK; otherwise throws an Error with any server-provided detail.
 * @param res - The fetch Response to validate.
 * @param context - A short label to indicate which request failed (e.g., "Trigger").
 * @throws Error when the response is not ok.
 */
async function ensureOk(res: Response, context: string): Promise<void> {
  if (res.ok) return;

  let detail = "";
  try {
    const data = await res.json();
    // Common error shapes: FastAPI often returns { detail }, custom APIs may return { error }
    detail = (data?.detail as string) || (data?.error as string) || "";
  } catch {
    // If parsing fails, omit detail and fall back to status text
  }

  const suffix = detail ? ` – ${detail}` : "";
  throw new Error(
    `${context} failed: ${res.status} ${res.statusText}${suffix}`
  );
}

/**
 * Triggers backend generation job.
 * @param body - Parameters sent by the UI to start generation.
 * @returns The trigger response from the backend.
 */
export async function triggerGeneration(
  body: TriggerBody
): Promise<TriggerResponse> {
  const payload = {
    message: body.message,
    model: body.model,
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Network/connection errors never reach ensureOk
    throw new Error(
      `Trigger request failed to send: ${
        (err as Error)?.message || String(err)
      }`
    );
  }

  await ensureOk(res, "Trigger");
  return res.json() as Promise<TriggerResponse>;
}

/**
 * Polls the backend for a job's current status.
 * @param jobId - The ID of the job to check.
 * @returns The job status response.
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/status/${jobId}`);
  } catch (err) {
    throw new Error(
      `Status request failed to send: ${(err as Error)?.message || String(err)}`
    );
  }

  await ensureOk(res, "Status");
  return res.json() as Promise<JobStatusResponse>;
}
