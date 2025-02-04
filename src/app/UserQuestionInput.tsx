import { fetchClinicalAnalysis } from "@/api/analyzeClinical";
import AnalyzeDropdownButton from "@/components/chat/AnalyzeDropdownButton";
import { Loader } from "@/components/clinicalScenarionAnalysis/Loader";
import Header from "@/components/form/Header";
import Label from "@/components/form/Label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const UserQuestionInputPage = () => {
  const navigate = useNavigate();
  const [textareaValue, setTextareaValue] = useState("");
  const [isResponseReady, setIsResponseReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleAnalyzeMCQs = async (selected_model: string) => {
    try {
      setIsAnalyzing(true);
      setProgress(0);
      const sessionId = crypto.randomUUID();

      const extractedScenarios = textareaValue
        .split("XXX")
        .map((scenario, index) => (index % 2 == 1 ? scenario.trim() : null))
        .filter(Boolean);

      const scenarioNum = extractedScenarios.length;
      const allResults = [];

      for (let i = 0; i < scenarioNum; i++) {
        console.log(`Processing scenario ${i + 1}/${allResults}`);

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
    setIsResponseReady(value.trim().length > 0);
  };

  return (
    <div className="flex flex-col">
      <Header title={"Analyze Your Questions"} />
      <div className="flex flex-col justify-center">
        <Label htmlFor="textareaValue" text="Questions" />
        <Textarea
          className="mb-4"
          placeholder="Paste your questions here."
          value={textareaValue}
          onChange={handleTextareaChange}
        />
        {isAnalyzing && (
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-sky-700 h-2.5 rounded-full"
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
  );
};

export default UserQuestionInputPage;
