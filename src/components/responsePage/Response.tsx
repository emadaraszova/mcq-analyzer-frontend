import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";

import { getJobStatus } from "@/api/generateResponse";
import { Loader } from "./Loader";
import { useJobStatus } from "@/hook/useJobStatus";
import type { ResponseProps, JobStatusResponse } from "@/types/responsePage";

/** --- Displays the generated text response with live job polling, copy, and markdown rendering --- **/
const Response = ({ jobId, onResponseReady, onResponse }: ResponseProps) => {
  const [copied, setCopied] = useState(false);

  // --- Poll job status until finished using reusable hook ---
  const { data, isLoading, isError, error } = useJobStatus<JobStatusResponse>(
    jobId,
    getJobStatus
  );

  const status = data?.status;

  // --- Prevent duplicate notifications in StrictMode or repeated renders ---
  const notifiedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (status !== "finished" || !data) return;

    const key = `job:${(data as any).job_id ?? ""}`;
    if (notifiedKeyRef.current === key) return;

    notifiedKeyRef.current = key;
    onResponse(data.result.response, data.result.session_id);
    onResponseReady();
  }, [status, data, onResponse, onResponseReady]);

  // --- Copy response to clipboard ---
  const handleCopy = async () => {
    if (status !== "finished" || !data) return;
    try {
      await navigator.clipboard.writeText(data.result.response ?? "");
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Couldn’t copy. Try again.");
    }
  };

  // --- Loading & error states ---
  if (
    isLoading ||
    status === "queued" ||
    status === "started" ||
    status === "running"
  ) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-red-900">
        Failed to fetch status. {(error as Error)?.message ?? ""}
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="text-red-900">
        Job failed. {(data as any)?.error ?? "Check worker logs."}
      </div>
    );
  }

  // --- Render finished response ---
  if (status === "finished") {
    const { response, note } = data!.result;

    return (
      <div className="border rounded-md p-4 bg-gray-100 overflow-y-auto h-[70vh]">
        {/* Header: note + copy button */}
        <div className="flex items-start justify-between mb-2">
          {note ? (
            <div className="text-sm text-slate-600">Note: {note}</div>
          ) : (
            <div />
          )}
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm bg-white hover:bg-slate-50"
            aria-label="Copy response to clipboard"
            title="Copy response to clipboard"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        {/* Markdown-rendered response */}
        <div className="p-2 mb-2 rounded-lg bg-sky-100 text-sky-900 whitespace-pre-wrap">
          <ReactMarkdown
            components={{
              strong: ({ children }) => (
                <strong className="font-bold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="italic text-gray-500">{children}</em>
              ),
            }}
          >
            {response}
          </ReactMarkdown>
        </div>
      </div>
    );
  }

  return <div className="text-gray-500 text-center">No response yet.</div>;
};

export default Response;
