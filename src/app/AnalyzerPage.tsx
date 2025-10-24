import { triggerGeneration } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/responsePage/AnalyzeDropdownButton";
import Header from "@/components/common/Header";
import Label from "@/components/common/Label";
import { Textarea } from "@/components/ui/textarea";
import { TriggerBody } from "@/types/responsePage";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/** --- Analyzer Page --- **/
const AnalyzerPage = () => {
  const navigate = useNavigate();

  // --- Local state ---
  const [textareaValue, setTextareaValue] = useState("");
  const [isResponseReady, setIsResponseReady] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>("");

  // --- API mutation: trigger analysis ---
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

  // --- Handle analysis trigger ---
  const handleAnalyzeMCQs = (selected_model: string) => {
    setSelectedModel(selected_model);
    mutate({
      message: textareaValue,
      model: selected_model,
    });
  };

  // --- Handle textarea input ---
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setTextareaValue(value);
    setIsResponseReady(value.trim().length > 0);
  };

  // --- UI layout ---
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <Header title={"Analyze Your Text"} />
      <div className="flex flex-col justify-center">
        <Label htmlFor="textareaValue" text="Your text" />
        <Textarea
          id="textareaValue"
          name="textareaValue"
          autoComplete="off"
          className="mb-4"
          placeholder="Paste your text here."
          value={textareaValue}
          onChange={handleTextareaChange}
        />
        <AnalyzeDropdownButton
          isResponseReady={isResponseReady}
          onAnalyze={handleAnalyzeMCQs}
          isPending={isPending}
        />
      </div>
    </div>
  );
};

export default AnalyzerPage;
