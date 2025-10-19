import { JobStatusResponse, TriggerBody, TriggerResponse } from "@/types/analyzedData";

const API_BASE = "http://localhost:8000/api/analyze-clinical";

// Parse error body if present
async function ensureOk(res: Response, context: string) {
  if (res.ok) return;
  let detail = "";
  try {
    const data = await res.json();
    detail = data?.detail || data?.error || "";
  } catch {
    // ignore
  }
  throw new Error(`${context} failed: ${res.status} ${res.statusText}${detail ? ` – ${detail}` : ""}`);
}

export async function triggerGeneration(body: TriggerBody): Promise<TriggerResponse> {
  // Map FE -> BE keys
  console.log(body)

const payload = {
    message: body.message,
    model: body.model,
  };

  const res = await fetch(`${API_BASE}/trigger`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  await ensureOk(res, "Trigger");
  return res.json();
}

export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const res = await fetch(`${API_BASE}/status/${jobId}`);
  await ensureOk(res, "Status");
  return res.json();
}