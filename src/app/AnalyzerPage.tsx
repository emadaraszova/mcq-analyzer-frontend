import { triggerGeneration } from "@/api/analyzeClinical";
import Header from "@/components/common/Header";
import Label from "@/components/common/Label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { TriggerBody } from "@/types/responsePage";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/** --- Analyzer Page (GPT-4o only) --- **/
const AnalyzerPage = () => {
  const navigate = useNavigate();

  const [textareaValue, setTextareaValue] = useState("");
  const [isResponseReady, setIsResponseReady] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: (body: TriggerBody) => triggerGeneration(body),
    onSuccess: (data) => {
      navigate(`/analyzed-data/${data.job_id}`, {
        state: {
          originalResponse: textareaValue,
          model: "gpt-4o",
        },
      });
    },
    onError: () => {
      toast.error("Failed to start analysis. Please try again.");
    },
  });

  const handleAnalyze = () => {
    mutate({
      message: textareaValue,
      model: "gpt-4o",
    });
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setTextareaValue(value);

    const hasDelimiterPair = /XXX\s*[\s\S]+?\s*XXX/.test(value);
    setIsResponseReady(hasDelimiterPair);
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center px-3 sm:px-4 py-8 overflow-x-hidden">
      <Header title="Analyze your text" />

      <div className="w-full min-w-0">
        <Label htmlFor="textareaValue" text="Your text" />
        <Textarea
          id="textareaValue"
          placeholder="Paste your text here."
          value={textareaValue}
          onChange={handleTextareaChange}
          className="
            mb-4
            w-full
            max-w-full
            min-w-0
            h-[32vh]
            sm:h-[40vh]
            resize-y
            overflow-x-hidden
          "
        />
      </div>

      <Button
        className="w-full"
        variant="outline"
        disabled={!isResponseReady || isPending}
        onClick={handleAnalyze}
      >
        {isPending ? "Analyzing..." : "Analyze"}
      </Button>

      <p className="text-xs text-amber-900 mt-2">
        ⚠️ Your text must contain <strong>XXX ... XXX</strong> delimiters.
      </p>
    </div>
  );
};

export default AnalyzerPage;
