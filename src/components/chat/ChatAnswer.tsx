import React from "react";
import { useFetchResponse } from "../../queries/useFetchResponse";
import { Loader } from "./Loader";

interface ChatAnswerProps {
  sessionId: string;
  prompt: string;
  model: string;
}

export const ChatAnswer = ({ sessionId, prompt, model }: ChatAnswerProps) => {
  const {
    data: response,
    isLoading,
    isError,
  } = useFetchResponse(sessionId, prompt, model);

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="text-red-900">
        Failed to fetch the response. Please try again.
      </div>
    );
  }

  return (
    <div className="flex-grow border rounded-md p-4 bg-gray-100 overflow-y-auto">
      {response ? (
        <div className="p-2 mb-2 rounded-lg bg-sky-100 text-sky-900">
          {response}
        </div>
      ) : (
        <div className="text-gray-500 text-center">No response available.</div>
      )}
    </div>
  );
};
