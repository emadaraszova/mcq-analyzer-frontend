import { triggerGeneration } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/chat/AnalyzeDropdownButton";
import { Loader } from "@/components/clinicalScenarionAnalysis/Loader";
import Header from "@/components/common/Header";
import Label from "@/components/common/Label";
import { Textarea } from "@/components/ui/textarea";
import { TriggerBody } from "@/types/response";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const UserQuestionInputPage = () => {
  const navigate = useNavigate();
  const [textareaValue, setTextareaValue] = useState("");
  const [isResponseReady, setIsResponseReady] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");
  

const { mutate, isPending } = useMutation({
    mutationFn: (body: TriggerBody) => triggerGeneration(body),
    onSuccess: (data) => {
      navigate(`/analyzed-data/${data.job_id}`, {
        state: {
          originalResponse: textareaValue,
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
      message: textareaValue,
      model: selected_model,
    });
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setTextareaValue(value);
    setIsResponseReady(value.trim().length > 0);
  };

  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <Header title={"Analyze Your Text"} />
      <div className="flex flex-col justify-center">
        <Label htmlFor="textareaValue" text="Your text" />
        <Textarea
          className="mb-4"
          placeholder="Paste your text here."
          value={textareaValue}
          onChange={handleTextareaChange}
        />
          <AnalyzeDropdownButton
            isResponseReady={isResponseReady}
            onAnalyze={handleAnalyzeMCQs}
          />
      </div>
    </div>
  );
};

export default UserQuestionInputPage;
