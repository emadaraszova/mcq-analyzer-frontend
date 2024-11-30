import React from "react";
import { Input } from "@/components/ui/input";
import Label from "./Label";

interface PromptEditorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isCustomPrompt: boolean;
  setIsCustomPrompt: (custom: boolean) => void;
}

const PromptEditor = ({
  prompt,
  setPrompt,
  setIsCustomPrompt,
}: PromptEditorProps) => {
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
    setIsCustomPrompt(true);
  };

  return (
    <div className="w-full">
      <Label htmlFor="prompt" text="Prompt" />
      <Input
        id="prompt"
        value={prompt}
        onChange={handlePromptChange}
        placeholder="Generate a USMLE Step 1 style MCQ..."
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
