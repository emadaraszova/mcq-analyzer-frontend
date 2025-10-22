import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Label from "../../common/Label";
import { EntryMode, EntryModeSelectorProps } from "@/types/analysisPage";


const EntryModeSelector = ({ value, onChange }: EntryModeSelectorProps) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      <Label htmlFor="entry-mode" text="Expected values input mode" />

      <RadioGroup
        value={value}
        onValueChange={(v) => onChange(v as EntryMode)}
        className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        <div className="flex items-center space-x-2 border rounded-md p-2">
          <RadioGroupItem value="expected-freq" id="freq" />
          <Label htmlFor="freq" text="Expected Frequencies" />
        </div>

        <div className="flex items-center space-x-2 border rounded-md p-2">
          <RadioGroupItem value="expected-prob" id="prob" />
          <Label htmlFor="prob" text="Expected Probabilities" />
        </div>
      </RadioGroup>

      <p className="text-xs text-slate-500 mt-2">
        In probabilities mode, values must sum to 1; we convert them to expected counts
        using your total observed.
      </p>
    </div>
  );
};

export default EntryModeSelector;