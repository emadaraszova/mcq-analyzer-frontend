import React, { useMemo, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useMutation } from "@tanstack/react-query";
import { ChatHeader } from "@/components/chat/ResponsePageHeader";
import { Response } from "@/components/chat/Response";
import { Button } from "@/components/ui/button";
import { triggerGeneration } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/chat/AnalyzeDropdownButton";
import { TriggerBody } from "@/types/response";
import toast from "react-hot-toast";

const queryClient = new QueryClient();

const Chat = () => {
  const { jobId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { prompt, model } = useMemo(
    () => location.state,
    [location.state]
  );

  const [isResponseReady, setIsResponseReady] = useState(false);
  const [response, setResponse] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { mutate, isPending } = useMutation({
    mutationFn: (body: TriggerBody) => triggerGeneration(body),
    onSuccess: (data) => {
      navigate(`/analyzed-data/${data.job_id}`, {
        state: {
          originalResponse: response,
          model: selectedModel,
        },
      });
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error("Failed to start generation. Please try again.");
    },
  });

  const handleAnalyzeMCQs = (selected_model: string) => {
    setSelectedModel(selected_model);
    mutate({
      message: response,
      model: selected_model,
    });
  };

  return (
    
      <div className="flex flex-col mx-auto px-6 py-2  h-full w-[90%] max-w-screen-xl relative">
        <ChatHeader model={model} prompt={prompt} />
        <Response
          jobId={jobId!}
          onResponseReady={() => setIsResponseReady(true)}
          onResponse={(response) => setResponse(response)}
        />
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white shadow-md flex flex-col items-center ">
          <div className="flex gap-4">
          <Button variant="outline" disabled={!isResponseReady}>
            Download the MCQs
          </Button>
          <AnalyzeDropdownButton
            isResponseReady={isResponseReady}
            onAnalyze={handleAnalyzeMCQs}
          />
          </div>
        </div>
      </div>
  );
};

export default Chat;
