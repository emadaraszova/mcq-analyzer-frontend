import { Button } from "@/components/ui/button";
import { QuickActionsBarProps } from "@/types/analysisPage";

/** --- Toolbar for quick data-entry actions --- **/
const QuickActionsBar = ({
  onEqualExpectation,
  onNormalizeProbabilities,
  onReset,
  entryMode,
}: QuickActionsBarProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {/* Equal expectation across categories */}
      <Button variant="secondary" onClick={onEqualExpectation}>
        Set equal expectation
      </Button>

      {/* Normalize probabilities (only available in probability mode) */}
      <Button
        variant="secondary"
        onClick={onNormalizeProbabilities}
        disabled={entryMode !== "expected-prob"}
        title={entryMode !== "expected-prob" ? "Only for probability mode" : ""}
      >
        Normalize probabilities
      </Button>

      {/* Reset all fields */}
      <Button variant="ghost" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
};

export default QuickActionsBar;
