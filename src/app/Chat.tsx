import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatAnswer } from "@/components/chat/ChatAnswer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import Dropdown components
import { fetchClinicalAnalysis } from "@/api/analyzeClinical"; // Import the API function

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
  const [response, setResponse] = useState<string>(""); // State to capture response
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<string>("gemini-1.5-flash"); // Default model

  const handleAnalyzeMCQs = async () => {
    try {
      const sessionId = crypto.randomUUID();
      setIsAnalyzing(true); // Show loading state
      const data = await fetchClinicalAnalysis({
        sessionId,
        prompt: response,
        model: selectedModel, // Use selected model
        numQuestions,
      });

      console.log("Extracted Clinical Data:", data); // Log the extracted data
      navigate("/analyzed-data", {
        state: { analyzedData: data, originalResponse: response },
      });
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md flex justify-center gap-4">
          {/* Download Button */}
          <Button variant="outline" disabled={!isResponseReady}>
            Download the MCQs
          </Button>

          {/* Analyze Dropdown Button */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  disabled={!isResponseReady || isAnalyzing}
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze the MCQs"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedModel("gemini-1.5-flash");
                    handleAnalyzeMCQs();
                  }}
                >
                  Analyze with gemini-1.5-flash
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedModel("gpt-4o");
                    handleAnalyzeMCQs();
                  }}
                >
                  Analyze with gpt-4o
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Chat;
