import { useQuery } from "@tanstack/react-query";

const fetchResponse = async (
  sessionId: string,
  prompt: string,
  model: string
) => {
  const response = await fetch("http://localhost:8000/api/generate-response", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      session_id: sessionId,
      message: prompt,
      model,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch data from backend");
  }

  const data = await response.json();
  return data.response; 
};

export const useFetchResponse = (sessionId: string, prompt: string, model: string) => {
  return useQuery({
    queryKey: ["response", sessionId, prompt, model],
    queryFn: () => fetchResponse(sessionId, prompt, model),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Retry once on failure
  });
};
