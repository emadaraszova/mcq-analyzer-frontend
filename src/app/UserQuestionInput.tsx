import { fetchClinicalAnalysis } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/chat/AnalyzeDropdownButton";
import Header from "@/components/form/Header";
import Label from "@/components/form/Label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserQuestionInputPage = () => {
  const navigate = useNavigate();
  const [textareaValue, setTextareaValue] = useState("");
  const [numQuestions, setNumQuestions] = useState("");
  const [isResponseReady, setIsResponseReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeMCQs = async (selected_model: string) => {
    try {
      const sessionId = crypto.randomUUID();
      setIsAnalyzing(true);

      const data = await fetchClinicalAnalysis({
        sessionId,
        prompt: textareaValue,
        model: selected_model,
        numQuestions: numQuestions,
      });

      console.log("Extracted Clinical Data:", data);

      navigate("/analyzed-data", {
        state: {
          analyzedData: data,
          originalResponse: textareaValue,
          model: selected_model,
        },
      });
    } catch (error) {
      console.error("Error analyzing MCQs:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setTextareaValue(value);
    setIsResponseReady(
      value.trim().length > 0 && numQuestions.trim().length > 0
    );
  };

  const handleNumQuestionsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    setNumQuestions(value);
    setIsResponseReady(
      value.trim().length > 0 && textareaValue.trim().length > 0
    );
  };

  return (
    <div className="flex flex-col">
      <Header title={"Analyze Your Questions"} />
      <div className="flex flex-col justify-center">
        <Label htmlFor="numQuestions" text="Number of Questions" />
        <Input
          id="numQuestions"
          type="number"
          placeholder="Enter the number of questions"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          className="w-full p-3 mb-4"
          min="0"
        />
        <small className="block text-sm text-sky-700">
          The number of questions helps to create a better prompt for data
          extraction.
        </small>
        <Label htmlFor="textareaValue" text="Questions" />
        <Textarea
          className="mb-4"
          placeholder="Paste your questions here."
          value={textareaValue}
          onChange={handleTextareaChange}
        />
        <AnalyzeDropdownButton
          isAnalyzing={isAnalyzing}
          isResponseReady={isResponseReady}
          onAnalyze={handleAnalyzeMCQs}
        />
      </div>
    </div>
  );
};

export default UserQuestionInputPage;
