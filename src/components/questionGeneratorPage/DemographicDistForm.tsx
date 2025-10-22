import { useMemo, useState } from "react";
import {
  DemographicCategory,
  DemographicDistributionFormProps,
} from "@/types/questionGeneratorPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";

const CATEGORIES: DemographicCategory[] = ["Gender", "Ethnicity", "Age"];

const DemographicDistributionForm = ({
  demographicData,
  setDemographicData,
}: DemographicDistributionFormProps) => {
  const initialCategory = useMemo<DemographicCategory>(() => {
    const nonEmpty = CATEGORIES.find((c) => demographicData[c].length > 0);
    return nonEmpty ?? "Gender";
  }, [demographicData]);

  const [selectedCategory, setSelectedCategory] =
    useState<DemographicCategory>(initialCategory);

  const rows = demographicData[selectedCategory];

  const handleAddRow = () => {
    const updated = { ...demographicData };
    updated[selectedCategory] = [...rows, { label: "", value: "" }];
    setDemographicData(updated);
  };

  const handleChange = (
    index: number,
    field: "label" | "value",
    newValue: string
  ) => {
    const updated = { ...demographicData };
    const newRows = [...rows];

    if (field === "value") {
      newRows[index].value =
        newValue === "" ? "" : Math.max(0, Number(newValue) || 0);
    } else {
      newRows[index].label = newValue;
    }

    updated[selectedCategory] = newRows;
    setDemographicData(updated);
  };

  const handleRemoveRow = (index: number) => {
    const updated = { ...demographicData };
    const newRows = [...rows];
    newRows.splice(index, 1);
    updated[selectedCategory] = newRows;
    setDemographicData(updated);
  };

  return (
    <div className="border rounded-lg p-4 bg-slate-50 space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="font-medium">Category:</span>
        <Select
          value={selectedCategory}
          onValueChange={(v: DemographicCategory) => setSelectedCategory(v)}
        >
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-[1fr_180px_80px] gap-3 text-sm text-gray-600 font-medium">
        <span>Label</span>
        <span>Count</span>
        <span></span>
      </div>

      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_180px_80px] gap-3 items-start"
          >
            {/* Label column */}
            <Input
              placeholder={`e.g. ${
                selectedCategory === "Gender"
                  ? "Female"
                  : selectedCategory === "Ethnicity"
                  ? "Hispanic"
                  : "30–40"
              }`}
              value={row.label}
              onChange={(e) => handleChange(index, "label", e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />

            {/* Count column */}
            <Input
              type="number"
              placeholder="0"
              value={row.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
              min={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.preventDefault();
              }}
            />

            {/* Remove button */}
            <div className="flex items-center">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveRow(index)}
              >
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

       <Button variant="outline" onClick={handleAddRow}>
          <Plus className="h-4 w-4 mr-2" /> Add row
        </Button>

      <p className="text-xs text-slate-500 mt-2">
        Fill rows in <strong>one</strong> category only. Counts must sum to the total number of questions.
      </p>
    </div>
  );
};

export default DemographicDistributionForm;
