import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { conditionOptions, modelOptions } from "@/data/options";
import SearchableSelect from "./SearchableSelect";
import Label from "../common/Label";
import { ParameterSelectorProps } from "@/types/questionGeneratorPage";

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

  const handleCustomConditionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setCustomCondition(value);
    setSelectedCondition(value);
  };

  return (
    <div className="flex flex-col space-y-4 w-full mb-5">
      {/* Row 1: Number of Questions + Model */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Number of Questions */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="numQuestions" text="Number of Questions" />
          <Input
            id="numQuestions"
            name="numQuestions"
            type="number"
            placeholder="Enter number of questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(e.target.value)}
            className="w-full h-10 text-sm"
            min="0"
            autoComplete="off"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="selectedModel" text="Model" />
          <SearchableSelect
            id="selectedModel"
            name="selectedModel"
            placeholder="Select Model"
            options={modelOptions}
            value={selectedModel}
            onChange={(value) => setSelectedModel(value)}
            triggerClassName="h-10 text-sm"
            ariaLabelledBy={undefined}
          />
          <small className="block text-xs text-sky-700">
            GPT-4o is selected by default. You can choose another model.
          </small>
        </div>
      </div>

      {/* Row 2: Condition + Country */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Condition */}
        <div className="flex flex-col space-y-2">
          <Label htmlFor="selectedCondition" text="Condition" />
          <SearchableSelect
            id="selectedCondition"
            name="selectedCondition"
            placeholder="Select Condition"
            options={conditionOptions}
            value={optionValues.has(selectedCondition) ? selectedCondition : ""}
            onChange={handleSelectCondition}
            triggerClassName="h-10 text-sm" // <- match Input height
          />
          <Label htmlFor="customCondition" text="Custom condition (optional)" />
          <Input
            id="customCondition"
            name="customCondition"
            placeholder="Or type a custom condition..."
            value={customCondition}
            onChange={handleCustomConditionChange}
            className="h-10 text-sm"
            autoComplete="off"
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
            name="country"
            placeholder="e.g., United States, Slovakia, Germany..."
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full h-10 text-sm"
            autoComplete="country-name"
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
