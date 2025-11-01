// --- Shared option types for dropdowns ---
export type Option = {
  value: string;
  label: string;
  isFree?: boolean; // indicates whether the model or option is free
};

// --- Props for the searchable select component ---
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

// --- Props for the parameter selection section ---
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

// --- Props for the editable prompt area ---
export type PromptEditorProps = {
  prompt: string;
  setPrompt: (prompt: string) => void;
  isCustomPrompt: boolean;
  setIsCustomPrompt: (custom: boolean) => void;
};

export type PromptParams = {
  topic: string;
  count?: string; // optional for demographic mode
  country?: string;
};

// --- Props for the generate button ---
export type GenerateButtonProps = {
  disabled?: boolean;
};

// --- Demographic distribution structures ---
export type DemographicCategory = "Gender" | "Ethnicity" | "Age";

export type DistRow = {
  label: string;
  value: number | ""; // empty string while typing
};

export type DemographicData = {
  Gender: DistRow[];
  Ethnicity: DistRow[];
  Age: DistRow[];
};

// --- Props for demographic distribution form ---
export type DemographicDistributionFormProps = {
  demographicData: DemographicData;
  setDemographicData: (data: DemographicData) => void;
};

// --- API body and response types ---
export type TriggerBody = {
  prompt: string;
  model: string;
  numQuestions?: number;
  demographicData?: DemographicData;
};

export type TriggerResponse = { job_id: string; enqueued: boolean };
