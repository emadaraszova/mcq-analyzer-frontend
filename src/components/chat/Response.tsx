import React, { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import { getJobStatus} from "@/api/generation";
import { Loader } from "./Loader";
import { ResponseProps, JobStatusResponse } from "@/types/response";



export const Response = memo(({ jobId, onResponseReady, onResponse }: ResponseProps) => {
  const { data, isLoading, isError, error } = useQuery<JobStatusResponse>({
    queryKey: ["jobStatus", jobId],
    queryFn: () => getJobStatus(jobId),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const d = query.state.data as JobStatusResponse | undefined;
      if (!d) return 2000;
      return d.status === "queued" || d.status === "started" || d.status === "running"
        ? 2000
        : false; 
    },
  });


  const status = data?.status;
  React.useEffect(() => {
    if (status !== "finished") return;
    onResponse(data!.result.response, data!.result.session_id);
    onResponseReady();
  }, [status, data, onResponse, onResponseReady]);

  if (isLoading || status === "queued" || status === "started" || status === "running") {
    return <Loader />;
  }

  if (isError) {
    return <div className="text-red-900">Failed to fetch status. {(error as Error)?.message ?? ""}</div>;
  }

  if (status === "failed") {
    return <div className="text-red-900">Job failed. {data?.error ?? "Check worker logs."}</div>;
  }

  if (status === "finished") {
    const { response, note } = data!.result;
     return (
      <div className="border rounded-md p-4 bg-gray-100 overflow-y-auto h-[70%]">
        {note && <div className="text-sm text-slate-600 mb-2">Note: {note}</div>}
        <div className="p-2 mb-2 rounded-lg bg-sky-100 text-sky-900 whitespace-pre-wrap">
          <ReactMarkdown
            children={response}
            components={{
              strong: ({ children }) => <strong className="font-bold">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-500">{children}</em>,
            }}
          />
        </div>
      </div>
    );
  }

  return <div className="text-gray-500 text-center">No response yet.</div>;
});