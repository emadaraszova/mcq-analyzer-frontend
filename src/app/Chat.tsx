import React, { useMemo } from "react";
import { useParams, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatAnswer } from "@/components/chat/ChatAnswer";

const queryClient = new QueryClient();

const Chat = () => {
  const { sessionId } = useParams();
  const location = useLocation();

  // Memoize location.state values to ensure they are stable
  const { model, prompt, isStreaming } = useMemo(
    () => location.state,
    [location.state]
  );

  console.log("isStreaming passed to Chat:", isStreaming);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col mx-auto p-6 space-y-4 h-screen w-[90%] max-w-screen-xl">
        <ChatHeader model={model} prompt={prompt} />
        <ChatAnswer
          sessionId={sessionId!}
          prompt={prompt}
          model={model}
          isStreaming={isStreaming}
        />
      </div>
    </QueryClientProvider>
  );
};

export default Chat;
