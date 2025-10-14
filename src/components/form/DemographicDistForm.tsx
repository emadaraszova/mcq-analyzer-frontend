import { useState } from "react";
import {
  DemographicCategory,
  DemographicDistributionFormProps,
} from "@/types/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Trash } from "lucide-react";

const CATEGORIES: DemographicCategory[] = ["Gender", "Ethnicity", "Age"];

const DemographicDistributionForm = ({
  demographicData,
  setDemographicData,
}: DemographicDistributionFormProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<DemographicCategory>("Gender");

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

      <div className="space-y-2">
        {rows.map((row, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_140px_92px] gap-2 items-center"
          >
            <Input
              placeholder={`label (e.g. Female, Hispanic, 30–40)`}
              value={row.label}
              onChange={(e) => handleChange(index, "label", e.target.value)}
            />
            <Input
              type="number"
              placeholder="Count"
              value={row.value}
              onChange={(e) => handleChange(index, "value", e.target.value)}
            />
            <Button variant="outline" onClick={() => handleRemoveRow(index)}>
              <Trash />
            </Button>
          </div>
        ))} 
      </div>

      <Button variant="outline" onClick={handleAddRow}>
        + Add Row
      </Button>
    </div>
  );
};

export default DemographicDistributionForm;
