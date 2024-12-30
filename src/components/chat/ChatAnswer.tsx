import React, { useState, memo } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { Loader } from "./Loader";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";

interface ChatAnswerProps {
  sessionId: string;
  prompt: string;
  model: string;
  isStreaming: boolean;
  onResponseReady: () => void;
  onResponse: (response: string) => void; // New callback prop to send response to the parent
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

export const ChatAnswer = memo(
  ({
    sessionId,
    prompt,
    model,
    isStreaming,
    onResponseReady,
    onResponse, // Receive the callback
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
      let isCancelled = false;
      let accumulatedResponse = "";

      if (isStreaming) {
        const fetchStreamingResponse = async () => {
          if (isCancelled) return;
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
                  if (isCancelled) return;
                  if (event.data && event.data !== "[DONE]") {
                    accumulatedResponse += event.data;
                    setResponse((prev) => {
                      const updatedResponse = prev + event.data;
                      return updatedResponse;
                    });
                    setIsStreamingLoading(false);
                  }
                },
                onerror(err) {
                  if (isCancelled) return;
                  console.error("Streaming error:", err);
                  setIsStreamingError(true);
                },
                onclose() {
                  if (isCancelled) return;
                  console.log("Streaming completed");
                  onResponse(accumulatedResponse);
                  onResponseReady();
                },
              }
            );
          } catch (err) {
            if (isCancelled) return;
            console.error("Error fetching streaming response:", err);
            setIsStreamingError(true);
          }
        };

        fetchStreamingResponse();
      }

      return () => {
        isCancelled = true;
      };
    }, [sessionId, prompt, model, isStreaming]);

    React.useEffect(() => {
      if (!isStreaming && data) {
        setResponse(data);
        onResponse(data);
        onResponseReady();
      }
    }, [isStreaming, data, onResponse, onResponseReady]);

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
      <div className="border rounded-md p-4 bg-gray-100 overflow-y-auto h-[70%]">
        {finalResponse ? (
          <div className="p-2 mb-2 rounded-lg bg-sky-100 text-sky-900 whitespace-pre-wrap">
            <ReactMarkdown
              children={finalResponse}
              components={{
                strong: ({ children }) => (
                  <strong className="font-bold">{children}</strong>
                ),
                em: ({ children }) => (
                  <em className="italic text-gray-500">{children}</em>
                ),
              }}
            />
          </div>
        ) : (
          <div className="text-gray-500 text-center">
            No response available.
          </div>
        )}
      </div>
    );
  }
);
