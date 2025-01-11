import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatAnswer } from "@/components/chat/ChatAnswer";
import { Button } from "@/components/ui/button";
import { fetchClinicalAnalysis } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/chat/AnalyzeDropdownButton";

const queryClient = new QueryClient();

const Chat = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { prompt, isStreaming, numQuestions, model } = useMemo(
    () => location.state,
    [location.state]
  );

  const [isResponseReady, setIsResponseReady] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeMCQs = async (selected_model: string) => {
    try {
      const sessionId = crypto.randomUUID();
      setIsAnalyzing(true);
      const data = await fetchClinicalAnalysis({
        sessionId,
        prompt: response,
        model: selected_model,
        numQuestions,
      });

      console.log("Extracted Clinical Data:", data);
      navigate("/analyzed-data", {
        state: {
          analyzedData: data,
          originalResponse: response,
          model: selected_model,
        },
      });
    } catch (error) {
      console.error("Error analyzing MCQs:", error);
    } finally {
      setIsAnalyzing(false);
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
          onResponse={(response) => setResponse(response)}
        />
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-center gap-4">
          <Button variant="outline" disabled={!isResponseReady}>
            Download the MCQs
          </Button>
          <AnalyzeDropdownButton
            isAnalyzing={isAnalyzing}
            isResponseReady={isResponseReady}
            onAnalyze={handleAnalyzeMCQs}
          />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Chat;
