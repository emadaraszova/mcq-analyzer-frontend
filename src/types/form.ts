export type Option = {
    value: string;
    label: string;
    isFree?: boolean;
  }

export type SearchableSelectProps = {
    placeholder: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
  }

export type ParameterSelectorProps = {
    numQuestions: string;
    setNumQuestions: React.Dispatch<React.SetStateAction<string>>;
    selectedDisease: string;
    setSelectedDisease: React.Dispatch<React.SetStateAction<string>>;
    selectedModel: string;
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  }

export type PromptEditorProps ={
    prompt: string;
    setPrompt: (prompt: string) => void;
    isCustomPrompt: boolean;
    setIsCustomPrompt: (custom: boolean) => void;
  }

export type GenerateButtonProps = {
  disabled?: boolean;
};