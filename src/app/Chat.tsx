import React, { useMemo, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatAnswer } from "@/components/chat/ChatAnswer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const queryClient = new QueryClient();

const Chat = () => {
  const { sessionId } = useParams();
  const location = useLocation();

  const { model, prompt, isStreaming } = useMemo(
    () => location.state,
    [location.state]
  );

  const [isResponseReady, setIsResponseReady] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col mx-auto p-6 space-y-4 h-screen w-[90%] max-w-screen-xl relative">
        <ChatHeader model={model} prompt={prompt} />
        <ChatAnswer
          sessionId={sessionId!}
          prompt={prompt}
          model={model}
          isStreaming={isStreaming}
          onResponseReady={() => setIsResponseReady(true)}
        />
        {/* Fixed Buttons with Tooltips */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-center gap-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" disabled={!isResponseReady}>
                Download the MCQs
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export the generated MCQs in CSV format.</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" disabled={!isResponseReady}>
                Analyze the MCQs
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Analyze the content of the generated clinical scenarios.</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Chat;
