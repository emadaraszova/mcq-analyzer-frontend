import { useCallback, useEffect } from "react";
import type { UseFormSetValue } from "react-hook-form";

/**
 * Hook: automatically (re)builds the prompt when inputs change,
 * unless the user opted into a custom prompt.
 *
 * Keeps styles/UX unchanged — only encapsulates effect logic.
 */
type Params = {
  isCustomPrompt: boolean;
  enableDemographicSpec: boolean;
  selectedCondition: string;
  numQuestions: string;
  country: string;
  setValue: UseFormSetValue<{ prompt: string }>;
  setPrompt: (p: string) => void;
  buildDefaultPrompt: (
    topic: string,
    count: string,
    country?: string
  ) => string;
  buildDemographicPrompt: (topic: string, country?: string) => string;
};

export const useAutoPrompt = ({
  isCustomPrompt,
  enableDemographicSpec,
  selectedCondition,
  numQuestions,
  country,
  setValue,
  setPrompt,
  buildDefaultPrompt,
  buildDemographicPrompt,
}: Params) => {
  const updatePrompt = useCallback(() => {
    if (isCustomPrompt) return;

    const generated = enableDemographicSpec
      ? buildDemographicPrompt(selectedCondition, country)
      : buildDefaultPrompt(selectedCondition, numQuestions, country);

    const trimmed = generated.trim();
    setPrompt(trimmed);
    setValue("prompt", trimmed);
  }, [
    isCustomPrompt,
    enableDemographicSpec,
    selectedCondition,
    numQuestions,
    country,
    setPrompt,
    setValue,
    buildDefaultPrompt,
    buildDemographicPrompt,
  ]);

  useEffect(() => {
    updatePrompt();
  }, [updatePrompt]);
};
