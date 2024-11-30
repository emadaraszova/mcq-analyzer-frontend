import React from "react";

interface ChatHeaderProps {
  model: string;
  prompt: string;
}

export const ChatHeader = ({ model, prompt }: ChatHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-center text-sky-700 mb-4">
        Chat with {model}
      </h1>
      <h2 className="text-lg font-medium text-center text-sky-600">
        Prompt: {prompt}
      </h2>
    </div>
  );
};
