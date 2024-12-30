import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatAnswer } from "@/components/chat/ChatAnswer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { fetchClinicalAnalysis } from "@/api/analyzeClinical"; // Import the API function

const queryClient = new QueryClient();

const sanitizeInput = (input: string): string => {
  // Remove invalid control characters and trim the input
  // eslint-disable-next-line no-control-regex
  return input.replace(/[\u0000-\u001F\u007F]/g, "").trim();
};

const Chat = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { model, prompt, isStreaming } = useMemo(
    () => location.state,
    [location.state]
  );

  const [isResponseReady, setIsResponseReady] = useState(false);
  const [response, setResponse] = useState<string>(""); // State to capture response
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeMCQs = async () => {
    try {
      const sessionId = crypto.randomUUID();
      setIsAnalyzing(true); // Show loading state
      const sanitizedResponse = sanitizeInput(response); // Sanitize the response
      console.log("sanitized_res:", sanitizedResponse);
      const data = await fetchClinicalAnalysis({
        sessionId,
        prompt: sanitizedResponse,
        model,
      });

      console.log("Extracted Clinical Data:", data); // Log the extracted data
      // Navigate to a new page with analyzed data
      navigate("/analyzed-data", { state: { analyzedData: data } });
    } catch (error) {
      console.error("Error analyzing MCQs:", error);
    } finally {
      setIsAnalyzing(false); // Reset loading state
    }
  };

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
          onResponse={(response) => setResponse(response)} // Capture response
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
              <Button
                variant="outline"
                onClick={handleAnalyzeMCQs}
                disabled={!isResponseReady || isAnalyzing}
              >
                {isAnalyzing ? "Analyzing..." : "Analyze the MCQs"}
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
