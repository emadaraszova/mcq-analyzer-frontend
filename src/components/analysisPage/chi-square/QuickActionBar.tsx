import { Button } from "@/components/ui/button";
import { QuickActionsBarProps } from "@/types/analysisPage";

const QuickActionsBar = ({
  onEqualExpectation,
  onNormalizeProbabilities,
  onReset,
  entryMode,
}: QuickActionsBarProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="secondary" onClick={onEqualExpectation}>
        Set equal expectation
      </Button>
      <Button
        variant="secondary"
        onClick={onNormalizeProbabilities}
        disabled={entryMode !== "expected-prob"}
        title={entryMode !== "expected-prob" ? "Only for probability mode" : ""}
      >
        Normalize probabilities
      </Button>
      <Button variant="ghost" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
};

export default QuickActionsBar;
