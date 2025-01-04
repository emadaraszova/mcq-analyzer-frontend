import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import GenerateButton from "@/components/form/GeneratorButton";
import PromptEditor from "@/components/form/PromptEditor";
import ParameterSelector from "@/components/form/ParameterSelector";
import Header from "@/components/form/Header";

const schema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty."),
});

type QuestionGeneratorFormData = z.infer<typeof schema>;

const QuestionGeneratorForm = () => {
  const [numQuestions, setNumQuestions] = useState<string>("");
  const [selectedDisease, setSelectedDisease] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4");
  const [isCustomPrompt, setIsCustomPrompt] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>(
    "Generate x USMLE Step 1 style MCQs on a presentation of y"
  );

  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuestionGeneratorFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      prompt,
    },
  });

  const updatePrompt = useCallback(() => {
    if (!isCustomPrompt) {
      const generatedPrompt = `Generate ${
        numQuestions || "x"
      } USMLE Step 1 style MCQs on a presentation of ${selectedDisease || "y"}`;
      setPrompt(generatedPrompt);
      setValue("prompt", generatedPrompt);
    }
  }, [numQuestions, selectedDisease, isCustomPrompt, setValue]);

  useEffect(() => {
    updatePrompt();
  }, [updatePrompt]);

  const onSubmit = (data: QuestionGeneratorFormData) => {
    console.log("Form submitted:", data);
    const sessionId = crypto.randomUUID();
    navigate(`/chat/${sessionId}`, {
      state: {
        model: selectedModel,
        prompt: data.prompt,
        isStreaming,
        numQuestions,
      },
    });
  };

  const handleStreamingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const checked = event.target.checked;
    console.log("Streaming checkbox changed:", checked); // Log the checkbox value
    setIsStreaming(checked);
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-screen-lg mx-auto">
      <Header title="Generator for USMLE Step 1 Style MCQs" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <ParameterSelector
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          selectedDisease={selectedDisease}
          setSelectedDisease={setSelectedDisease}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
        />
        <PromptEditor
          prompt={prompt}
          setPrompt={(value) => {
            setPrompt(value);
            setValue("prompt", value);
          }}
          isCustomPrompt={isCustomPrompt}
          setIsCustomPrompt={setIsCustomPrompt}
        />
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="streamingCheckbox"
            checked={isStreaming}
            onChange={handleStreamingChange}
          />
          <label htmlFor="streamingCheckbox">Enable Streaming</label>
        </div>
        {errors.prompt && (
          <p className="text-red-900 text-sm">{errors.prompt.message}</p>
        )}
        <GenerateButton />
      </form>
    </div>
  );
};

export default QuestionGeneratorForm;
