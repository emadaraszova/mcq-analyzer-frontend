import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatAnswer } from "@/components/chat/ChatAnswer";
import { Button } from "@/components/ui/button";
import { fetchClinicalAnalysis } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/chat/AnalyzeDropdownButton";
import { Loader } from "@/components/clinicalScenarionAnalysis/Loader";

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
  const [progress, setProgress] = useState(0);

  const handleAnalyzeMCQs = async (selected_model: string) => {
    try {
      const sessionId = crypto.randomUUID();
      setIsAnalyzing(true);
      setProgress(0);

      // ✅ Extracts only the text between "XXX"
      const extractedScenarios = response
        .match(/XXX\s*(.*?)\s*XXX/g)
        ?.map(match => match.replace(/XXX/g, "").trim()) || [];

      const scenarioNum = extractedScenarios.length;
      const allResults = [];

      for (let i = 0; i < scenarioNum; i++) {
        console.log(`Processing scenario ${i + 1}/${scenarioNum}`);

        const data = await fetchClinicalAnalysis({
          sessionId,
          prompt: extractedScenarios[i],
          model: selected_model,
          numQuestions: "1",
        });

        allResults.push(data);
        setProgress(((i + 1) / scenarioNum) * 100);
      }

      navigate("/analyzed-data", {
        state: {
          analyzedData: allResults,
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

          {/* ✅ Progress UI */}
          {isAnalyzing && (
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
              <div
                className="bg-sky-700 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
              <Loader />
            </div>
          )}

          {!isAnalyzing && (
            <AnalyzeDropdownButton
              isAnalyzing={isAnalyzing}
              isResponseReady={isResponseReady}
              onAnalyze={handleAnalyzeMCQs}
            />
          )}
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Chat;
