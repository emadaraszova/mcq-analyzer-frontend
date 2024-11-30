import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  placeholder: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
}

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
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SearchableSelect;
