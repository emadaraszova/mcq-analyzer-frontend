import React from "react";
import { Textarea } from "../ui/textarea";
import { PromptEditorProps } from "@/types/questionGeneratorPage";

/** --- Text editor for customizing or viewing the generated prompt --- **/
const PromptEditor = ({
  prompt,
  setPrompt,
  setIsCustomPrompt,
}: PromptEditorProps) => {
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setIsCustomPrompt(true);
  };

  return (
    // min-w-0 + max-w-full are key to prevent flex overflow
    <div className="w-full min-w-0 max-w-full">
      <Textarea
        id="prompt"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Generate a case-based MCQ..."
        className="
          w-full min-w-0 max-w-full
          border rounded-lg p-4
          text-sm sm:text-lg
          resize-y overflow-y-auto
          h-[28vh] min-h-[160px] max-h-[320px]
          sm:h-[38vh] sm:min-h-[220px] sm:max-h-[420px]
          md:h-[45vh] md:min-h-[260px] md:max-h-[520px]
        "
      />

      <small className="block text-sm text-sky-700 mt-1 max-w-full">
        Edit the prompt manually or let it auto-generate based on your
        selections.
      </small>

      <p className="text-xs sm:text-sm text-amber-900 mt-2 max-w-full leading-snug">
        ⚠️ Please double-check your final prompt before generating. If the
        prompt does not include the required <strong>XXX … XXX </strong>
        delimiters, the system may fail to produce the requested number of
        questions, and clinical scenario analysis will not be available.
      </p>
    </div>
  );
};

export default PromptEditor;
