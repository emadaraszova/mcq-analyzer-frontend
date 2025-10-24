export type Option = {
  value: string;
  label: string;
  isFree?: boolean;
};

export type SearchableSelectProps = {
  id: string;
  name?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  ariaLabelledBy?: string;
  triggerClassName?: string;
};
export type ParameterSelectorProps = {
  numQuestions: string;
  setNumQuestions: (v: string) => void;
  selectedCondition: string;
  setSelectedCondition: (v: string) => void;
  selectedModel: string;
  setSelectedModel: (v: string) => void;
  country: string;
  setCountry: (v: string) => void;
};

export type PromptEditorProps = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isCustomPrompt: boolean;
  setIsCustomPrompt: (custom: boolean) => void;
};

export type GenerateButtonProps = {
  disabled?: boolean;
};

export type DemographicCategory = "Gender" | "Ethnicity" | "Age";

export type DistRow = {
  label: string;
  value: number | ""; // empty while typing
};

export type DemographicData = {
  Gender: DistRow[];
  Ethnicity: DistRow[];
  Age: DistRow[];
};

export type DemographicDistributionFormProps = {
  demographicData: DemographicData;
  setDemographicData: (data: DemographicData) => void;
};

export type TriggerBody = {
  prompt: string;
  model: string;
  numQuestions?: number;
  demographicData?: DemographicData;
};

// What the trigger endpoint returns
export type TriggerResponse = { job_id: string; enqueued: boolean };
