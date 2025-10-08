import React from "react";
import { Input } from "@/components/ui/input";
import { diseaseOptions, modelOptions } from "@/data/options";
import SearchableSelect from "./SearchableSelect";
import Label from "./Label";
import { ParameterSelectorProps } from "@/types/form";

const ParameterSelector = ({
  numQuestions,
  setNumQuestions,
  selectedDisease,
  setSelectedDisease,
  selectedModel,
  setSelectedModel,
}: ParameterSelectorProps) => (
  <div className="flex flex-col space-y-4 w-full mb-5">
    {/* Row: Number of Questions + Model */}
    <div className="flex flex-col md:flex-row gap-4">
      {/* Number of Questions */}
      <div className="flex-1">
        <Label htmlFor="numQuestions" text="Number of Questions" />
        <Input
          id="numQuestions"
          type="number"
          placeholder="Enter number of questions"
          value={numQuestions}
          onChange={(e) => setNumQuestions(e.target.value)}
          className="w-full h-9 text-sm"
          min="0"
        />
      </div>

      {/* Model */}
      <div className="flex-1 flex flex-col">
        <Label htmlFor="selectedModel" text="Model" />
        <SearchableSelect
          placeholder="Select Model"
          options={modelOptions}
          value={selectedModel}
          onChange={(value) => setSelectedModel(value)}
        />
        <small className="block text-xs text-sky-700 mt-1">
          GPT-4o is selected by default. You can choose another model.
        </small>
      </div>
    </div>

    {/* Disease */}
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
