import React from "react";
import { Input } from "@/components/ui/input";
import { diseaseOptions, modelOptions } from "@/data/options";
import SearchableSelect from "./SearchableSelect";
import Label from "./Label";

interface ParameterSelectorProps {
  numQuestions: string;
  setNumQuestions: React.Dispatch<React.SetStateAction<string>>;
  selectedDisease: string;
  setSelectedDisease: React.Dispatch<React.SetStateAction<string>>;
  selectedModel: string;
  setSelectedModel: React.Dispatch<React.SetStateAction<string>>;
}

const ParameterSelector = ({
  numQuestions,
  setNumQuestions,
  selectedDisease,
  setSelectedDisease,
  selectedModel,
  setSelectedModel,
}: ParameterSelectorProps) => (
  <div className="flex flex-col space-y-4 w-full mb-5">
    {/* Number of Questions Section */}
    <div className="flex-grow">
      <Label htmlFor="numQuestions" text="Number of Questions" />
      <Input
        id="numQuestions"
        type="number"
        placeholder="Enter number of questions"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        className="w-full p-3"
        min="0"
      />
    </div>

    {/* Model Section */}
    <div className="flex flex-col space-y-2">
      <Label htmlFor="selectedModel" text="Model" />
      <SearchableSelect
        placeholder="Select Model"
        options={modelOptions}
        value={selectedModel}
        onChange={(value) => setSelectedModel(value)}
      />
      <small className="block text-sm text-sky-700">
        GPT-4o is selected by default. You can choose another model from the
        dropdown.
      </small>
    </div>

    {/* Disease Section */}
    <div className="flex flex-col space-y-2">
      <Label htmlFor="selectedDisease" text="Disease" />
      <SearchableSelect
        placeholder="Select Disease"
        options={diseaseOptions}
        value={selectedDisease}
        onChange={(value) => setSelectedDisease(value)}
      />
    </div>
  </div>
);

export default ParameterSelector;
