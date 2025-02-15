import React from "react";
import Label from "./Label";
import { Textarea } from "../ui/textarea";
import { PromptEditorProps } from "@/types/form";

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
    <div className="w-full">
      <Label htmlFor="prompt" text="Prompt" />
      <Textarea
        id="prompt"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Generate a case-based MCQ..."
        className="h-24 w-full resize-none p-4 text-sm sm:text-lg border rounded-lg"
      />
      <small className="block text-sm text-sky-700 mt-1">
        Edit the prompt manually or let it auto-generate based on your
        selections.
      </small>
    </div>
  );
};

export default PromptEditor;
