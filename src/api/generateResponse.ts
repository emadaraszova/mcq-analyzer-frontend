import { TriggerBody, TriggerResponse } from "@/types/questionGeneratorPage";
import { JobStatusResponse } from "@/types/responsePage";

const API_BASE = import.meta.env.VITE_API_URL;

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
    detail = (data?.detail as string) || (data?.error as string) || "";
  } catch {
    // If parsing fails, omit detail and use generic status info
  }

  const suffix = detail ? ` – ${detail}` : "";
  throw new Error(
    `${context} failed: ${res.status} ${res.statusText}${suffix}`
  );
}

/**
 * Sends a request to trigger question generation.
 * @param body - Parameters defining the question generation request.
 * @returns The backend response containing the job ID or confirmation.
 */
export async function triggerGeneration(
  body: TriggerBody
): Promise<TriggerResponse> {
  const payload = {
    message: body.prompt,
    model: body.model,
    number_of_questions: body.numQuestions,
    demographicData: body.demographicData,
  };

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/generate-response/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (err) {
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
 * Retrieves the current status of a generation job.
 * @param jobId - The unique identifier of the job to query.
 * @returns The job status response object.
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}/api/generate-response/status/${jobId}`);
  } catch (err) {
    throw new Error(
      `Status request failed to send: ${(err as Error)?.message || String(err)}`
    );
  }

  await ensureOk(res, "Status");
  return res.json() as Promise<JobStatusResponse>;
}
