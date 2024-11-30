import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatAnswer } from "@/components/chat/ChatAnswer";

const queryClient = new QueryClient();

const Chat = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const { model, prompt } = location.state;

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col mx-auto p-6 space-y-4 h-screen w-[90%] max-w-screen-xl">
        <ChatHeader model={model} prompt={prompt} />
        <ChatAnswer sessionId={sessionId!} prompt={prompt} model={model} />
      </div>
    </QueryClientProvider>
  );
};

export default Chat;
