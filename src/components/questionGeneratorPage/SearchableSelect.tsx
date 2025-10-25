import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { SearchableSelectProps } from "@/types/questionGeneratorPage";

/** --- Custom searchable dropdown select with optional “Free/Paid” badges --- **/
const SearchableSelect = ({
  id,
  name,
  ariaLabelledBy,
  placeholder,
  options,
  value,
  onChange,
  triggerClassName,
}: SearchableSelectProps) => {
  // --- Search input state ---
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);

  // --- Filter options as user types ---
  useEffect(() => {
    setFilteredOptions(
      options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  // --- UI layout ---
  return (
    <Select value={value} onValueChange={onChange}>
      {/* Dropdown trigger */}
      <SelectTrigger
        id={id}
        aria-labelledby={ariaLabelledBy}
        className={`w-full ${triggerClassName ?? ""}`}
        name={name}
      >
        <SelectValue placeholder={placeholder}>
          {value ? options.find((o) => o.value === value)?.label : ""}
        </SelectValue>
      </SelectTrigger>

      {/* Dropdown content */}
      <SelectContent>
        {/* Search input */}
        <div className="p-2">
          <Input
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2"
          />
        </div>

        {/* Filtered options list */}
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
