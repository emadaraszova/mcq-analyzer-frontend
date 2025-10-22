import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelectProps } from "@/types/questionGeneratorPage";

const SearchableSelect = ({
  placeholder,
  options,
  value,
  onChange,
}: SearchableSelectProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  return (
    <Select onValueChange={(selectedValue) => onChange(selectedValue)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder}>
          {value ? options.find((option) => option.value === value)?.label : ""}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <div className="p-2">
          <Input
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>
        {filteredOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <div className="flex items-center justify-between">
              <span>{option.label}</span>
              {option.isFree !== undefined && (
                <span
                  className={`ml-2 text-xs px-2 py-1 rounded ${
                    option.isFree
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {option.isFree ? "Free" : "Paid"}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SearchableSelect;
