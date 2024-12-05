import React, { useState } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Loader } from "./Loader";
import { useQuery } from "@tanstack/react-query";

interface ChatAnswerProps {
  sessionId: string;
  prompt: string;
  model: string;
  isStreaming: boolean;
}

const fetchNonStreamingResponse = async (
  sessionId: string,
  prompt: string,
  model: string
) => {
  const res = await fetch(
    "http://localhost:8000/api/generate-response?stream=false",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        message: prompt,
        model,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch non-streaming response");
  }

  const data = await res.json();
  return data.response; // Extract the response text
};

export const ChatAnswer = ({
  sessionId,
  prompt,
  model,
  isStreaming,
}: ChatAnswerProps) => {
  const [response, setResponse] = useState<string>(""); // Accumulated response
  const [isStreamingLoading, setIsStreamingLoading] = useState<boolean>(true);
  const [isStreamingError, setIsStreamingError] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["fetchResponse", sessionId, prompt, model],
    queryFn: () => fetchNonStreamingResponse(sessionId, prompt, model),
    enabled: !isStreaming, // Only run for non-streaming mode
  });

  React.useEffect(() => {
    if (isStreaming) {
      const fetchStreamingResponse = async () => {
        setIsStreamingLoading(true);
        setIsStreamingError(false);
        setResponse("");

        try {
          console.log("Streaming mode enabled");
          await fetchEventSource(
            "http://localhost:8000/api/generate-response?stream=true",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                session_id: sessionId,
                message: prompt,
                model,
              }),

              onmessage(event) {
                if (event.data && event.data !== "[DONE]") {
                  setResponse((prev) => prev + event.data);
                  console.log(event.data);
                  setIsStreamingLoading(false);
                }
              },
              onerror(err) {
                console.error("Streaming error:", err);
                setIsStreamingError(true);
              },
              onclose() {
                console.log("Streaming completed");
              },
            }
          );
        } catch (err) {
          console.error("Error fetching streaming response:", err);
          setIsStreamingError(true);
        }
      };

      fetchStreamingResponse();
    }
  }, [sessionId, prompt, model, isStreaming]);

  if (isStreaming ? isStreamingLoading : isLoading) {
    return <Loader />;
  }

  if (isStreaming ? isStreamingError : isError) {
    return (
      <div className="text-red-900">
        Failed to fetch the response. Please try again.
      </div>
    );
  }

  const finalResponse = isStreaming ? response : data;

  return (
    <div className="flex-grow border rounded-md p-4 bg-gray-100 overflow-y-auto">
      {finalResponse ? (
        <div className="p-2 mb-2 rounded-lg bg-sky-100 text-sky-900 whitespace-pre-wrap">
          {finalResponse}
        </div>
      ) : (
        <div className="text-gray-500 text-center">No response available.</div>
      )}
    </div>
  );
};
