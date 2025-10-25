import { useQuery } from "@tanstack/react-query";

/** --- Generic polling hook for job status tracking --- **/
export function useJobStatus<T>(
  jobId: string | undefined,
  fetchFn: (id: string) => Promise<T>
) {
  const query = useQuery({
    queryKey: ["jobStatus", jobId],
    queryFn: () => fetchFn(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const d: any = query.state.data;
      if (!d) return 2000;
      return ["queued", "started", "running"].includes(d.status) ? 2000 : false;
    },
  });

  return query;
}
