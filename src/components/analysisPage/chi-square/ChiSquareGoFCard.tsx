import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import ChiSquareGoF from "./ChiSquareGoF";

/** --- Collapsible card wrapper for Chi-Square GoF calculator --- **/
const ChiSquareGoFCard = () => {
  const [open, setOpen] = useState(false); // toggle open/closed state

  return (
    <div className="w-full bg-blue-50 border rounded-lg p-4">
      {/* Header section with title and toggle button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Chi-Square Goodness-of-Fit</h3>
          <p className="text-sm text-slate-600">
            Compare observed counts to expected counts or probabilities.
          </p>
        </div>

        <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
          {open ? (
            <ChevronUp className="mr-2 h-4 w-4" />
          ) : (
            <ChevronDown className="mr-2 h-4 w-4" />
          )}
          {open ? "Hide calculator" : "Open calculator"}
        </Button>
      </div>

      {/* Expandable content */}
      {open && (
        <div className="mt-4">
          <ChiSquareGoF />
        </div>
      )}
    </div>
  );
};

export default ChiSquareGoFCard;
