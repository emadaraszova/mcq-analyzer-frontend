import React, { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { conditionOptions, modelOptions } from "@/data/options";
import SearchableSelect from "./SearchableSelect";
import Label from "../common/Label";
import { ParameterSelectorProps } from "@/types/form";

const ParameterSelector = ({
  numQuestions,
  setNumQuestions,
  selectedCondition,
  setSelectedCondition,
  selectedModel,
  setSelectedModel,
  country,
  setCountry,
}: ParameterSelectorProps) => {
  const optionValues = useMemo(
    () => new Set(conditionOptions.map((o: any) => o.value ?? o)),
    []
  );
  const [customCondition, setCustomCondition] = useState<string>(
    optionValues.has(selectedCondition) ? "" : selectedCondition || ""
  );

  const handleSelectCondition = (value: string) => {
    setSelectedCondition(value);
    setCustomCondition("");
  };

  const handleCustomConditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCondition(value);
    setSelectedCondition(value);
  };

  return (
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

      {/* Row: Condition + Country (SIDE BY SIDE on md+) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Condition */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="selectedCondition" text="Condition" />
          <SearchableSelect
            placeholder="Select Condition"
            options={conditionOptions}
            value={optionValues.has(selectedCondition) ? selectedCondition : ""}
            onChange={handleSelectCondition}
          />
          <Input
            id="customCondition"
            placeholder="Or type a custom condition..."
            value={customCondition}
            onChange={handleCustomConditionChange}
            className="h-9 text-sm"
          />
          <small className="block text-xs text-sky-700">
            This information will be used in the prompt.
          </small>
        </div>

        {/* Country */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="country" text="Country" />
          <Input
            id="country"
            placeholder="e.g., United States, Slovakia, Germany..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-9 text-sm"
          />
          <small className="block text-xs text-sky-700">
            This information will be used in the prompt.
          </small>
        </div>
      </div>
    </div>
  );
};

export default ParameterSelector;
