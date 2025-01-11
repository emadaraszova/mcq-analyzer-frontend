export interface ParameterSelectorProps {
    numQuestions: string;
    setNumQuestions: React.Dispatch<React.SetStateAction<string>>;
    selectedDisease: string;
    setSelectedDisease: React.Dispatch<React.SetStateAction<string>>;
    selectedModel: string;
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  }

export interface Option {
    value: string;
    label: string;
    isFree?: boolean;
  }

export interface SearchableSelectProps {
    placeholder: string;
    options: Option[];
    value: string;
    onChange: (value: string) => void;
  }

export interface ParameterSelectorProps {
    numQuestions: string;
    setNumQuestions: React.Dispatch<React.SetStateAction<string>>;
    selectedDisease: string;
    setSelectedDisease: React.Dispatch<React.SetStateAction<string>>;
    selectedModel: string;
    setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
  }