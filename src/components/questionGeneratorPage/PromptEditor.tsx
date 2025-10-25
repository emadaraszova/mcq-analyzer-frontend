import Label from "../common/Label";
import { Textarea } from "../ui/textarea";
import { PromptEditorProps } from "@/types/questionGeneratorPage";

/** --- Text editor for customizing or viewing the generated prompt --- **/
const PromptEditor = ({
  prompt,
  setPrompt,
  setIsCustomPrompt,
}: PromptEditorProps) => {
  // --- Handle manual prompt edits ---
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    setIsCustomPrompt(true); // mark as user-modified
  };

  // --- UI layout ---
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-3xl">
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
    </div>
  );
};

export default PromptEditor;
