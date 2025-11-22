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

  // --- Handle textarea input (UPDATED) ---
  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setTextareaValue(value);

    // Button active ONLY if text contains at least one XXX <text> XXX pair
    const hasDelimiterPair = /XXX\s*[\s\S]+?\s*XXX/.test(value);
    setIsResponseReady(hasDelimiterPair);
  };

  // --- UI layout ---
  return (
    <div className="max-w-3xl mx-auto flex p-8 flex-col items-center">
      <Header title="Analyze Your Text" />
      <div className="w-full">
        <Label htmlFor="textareaValue" text="Your text" />
      </div>
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
      {/* Disclaimer */}
      <p className="text-xs sm:text-sm text-amber-900 mt-2 max-w-3xl leading-snug">
        ⚠️ Please ensure your text includes the required{" "}
        <strong>XXX ... XXX</strong> delimiters. Without them, the analysis will
        not be available.
      </p>
    </div>
  );
};

export default AnalyzerPage;
