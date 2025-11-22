import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import GenerateButton from "@/components/questionGeneratorPage/GeneratorButton";
import PromptEditor from "@/components/questionGeneratorPage/PromptEditor";
import ParameterSelector from "@/components/questionGeneratorPage/ParameterSelector";
import Header from "@/components/common/Header";
import { triggerGeneration } from "@/api/generateResponse";
import { DemographicData, TriggerBody } from "@/types/questionGeneratorPage";
import DemographicDistributionForm from "@/components/questionGeneratorPage/DemographicDistForm";
import { buildDefaultPrompt, buildDemographicPrompt } from "@/lib/prompts";

/** --- Validation schema --- **/
const schema = z.object({
  prompt: z.string().min(1, "Prompt cannot be empty."),
});

type QuestionGeneratorFormData = z.infer<typeof schema>;

/** --- Main component --- **/
const QuestionGeneratorPage = () => {
  // --- UI state ---
  const [numQuestions, setNumQuestions] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");
  const [isCustomPrompt, setIsCustomPrompt] = useState<boolean>(false);
  const [enableDemographicSpec, setEnableDemographicSpec] = useState(false);
  const [country, setCountry] = useState<string>("");

  // Demographic data form state
  const [demographicData, setDemographicData] = useState<DemographicData>({
    Gender: [],
    Ethnicity: [],
    Age: [],
  });

  // Default prompt setup
  const [prompt, setPrompt] = useState<string>(
    buildDefaultPrompt({ topic: "x", count: "y", country })
  );

  const navigate = useNavigate();

  // --- Form setup ---
  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<QuestionGeneratorFormData>({
    resolver: zodResolver(schema),
    defaultValues: { prompt },
  });

  // --- Auto-update prompt unless manually edited ---
  const updatePrompt = useCallback(() => {
    if (isCustomPrompt) return;

    const generated = enableDemographicSpec
      ? buildDemographicPrompt({ topic: selectedCondition, country })
      : buildDefaultPrompt({
          topic: selectedCondition,
          count: numQuestions,
          country,
        });

    const trimmed = generated.trim();
    setPrompt(trimmed);
    setValue("prompt", trimmed);
  }, [
    isCustomPrompt,
    enableDemographicSpec,
    selectedCondition,
    numQuestions,
    country,
    setValue,
  ]);

  useEffect(() => {
    updatePrompt();
  }, [updatePrompt]);

  // --- API mutation: trigger generation job ---
  const { mutate, isPending } = useMutation({
    mutationFn: (body: TriggerBody) => triggerGeneration(body),
    onSuccess: (data) => {
      // Default to 1 if numQuestions is empty or invalid (for client state)
      const questionsToRequest =
        numQuestions === "" || isNaN(Number(numQuestions))
          ? 1
          : Number(numQuestions);

      navigate(`/chat/${data.job_id}`, {
        state: {
          prompt,
          model: selectedModel,
          requestedNumQuestions: questionsToRequest,
          demographicData: enableDemographicSpec ? demographicData : null,
        },
      });
    },
    onError: (err: unknown) => {
      console.error(err);
      toast.error("Failed to start generation. Please try again.");
    },
  });

  // --- Demographic validation before submit ---
  const validateDemographics = (): string | null => {
    if (!enableDemographicSpec) return null;

    if (!numQuestions || Number.isNaN(Number(numQuestions))) {
      return "Please enter a valid number of questions when using demographic distributions.";
    }

    const filledCategories = (["Gender", "Ethnicity", "Age"] as const).filter(
      (k) => demographicData[k].length > 0
    );

    if (filledCategories.length !== 1) {
      return "Please fill exactly one category (Gender OR Ethnicity OR Age).";
    }

    const rows = demographicData[filledCategories[0]];
    const invalidRow = rows.some(
      (r) => !r.label || r.value === "" || Number.isNaN(Number(r.value))
    );
    if (invalidRow) {
      return "All rows must have a label and a numeric value.";
    }

    const n = Number(numQuestions);
    if (Number.isFinite(n) && n > 0) {
      const total = rows.reduce((acc, r) => acc + Number(r.value), 0);
      if (total !== n) {
        return `The sum of counts (${total}) must equal the number of questions (${n}).`;
      }
    }

    return null;
  };

  // --- Form submission handler ---
  const onSubmit = (data: QuestionGeneratorFormData) => {
    const demographicsError = validateDemographics();
    if (demographicsError) {
      toast.error(demographicsError);
      return;
    }

    // Normalize number of questions: "" or invalid -> 1
    const parsed = parseInt(numQuestions, 10);
    const questionsToRequest =
      Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

    const body: TriggerBody = {
      prompt: data.prompt,
      model: selectedModel,
      numQuestions: questionsToRequest,
      ...(enableDemographicSpec ? { demographicData } : {}),
    };

    mutate(body);
  };

  // --- UI layout ---
  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-screen-lg mx-auto">
      <Header title="Generate MCQs" />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-6">
        <ParameterSelector
          numQuestions={numQuestions}
          setNumQuestions={setNumQuestions}
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          selectedModel={selectedModel}
          setSelectedModel={setSelectedModel}
          country={country}
          setCountry={setCountry}
        />

        {/* Demographic toggle and form */}
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={enableDemographicSpec}
              onChange={(e) => setEnableDemographicSpec(e.target.checked)}
            />
            <span>Specify demographic distributions</span>
          </label>

          {enableDemographicSpec && (
            <DemographicDistributionForm
              demographicData={demographicData}
              setDemographicData={setDemographicData}
            />
          )}
        </div>

        {/* Prompt editor */}
        <PromptEditor
          prompt={prompt}
          setPrompt={(value) => {
            setPrompt(value);
            setValue("prompt", value);
          }}
          isCustomPrompt={isCustomPrompt}
          setIsCustomPrompt={setIsCustomPrompt}
        />

        {errors.prompt && (
          <p className="text-red-900 text-sm">{errors.prompt.message}</p>
        )}

        <GenerateButton disabled={isPending} />
      </form>
    </div>
  );
};

export default QuestionGeneratorPage;
