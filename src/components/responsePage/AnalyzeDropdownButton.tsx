import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AnalyzeDropdownButtonProps } from "@/types/responsePage";

/** --- Dropdown button to choose model for text analysis --- **/
const AnalyzeDropdownButton = ({
  isResponseReady,
  onAnalyze,
  isPending,
  blockAnalyze,
}: AnalyzeDropdownButtonProps) => {
  // Disable button if analysis is pending, response not ready, or note indicates no delimiters
   const isDisabled: boolean =
    !isResponseReady || !!isPending || !!blockAnalyze;

  // --- UI layout ---
  return (
    <DropdownMenu>
      {/* Main button trigger */}
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={!!isDisabled}>
          {isPending ? "Analyzing..." : "Analyze the text"}
        </Button>
      </DropdownMenuTrigger>

      {/* Dropdown content: model options */}
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => onAnalyze("gemini-2.5-flash")}>
          <span>Analyze with gemini-2.5-flash</span>
          <span className="ml-2 text-xs px-2 py-1 rounded bg-green-200 text-green-800">
            Free
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAnalyze("llama3.3:latest")}>
          <span>Analyze with llama3.3</span>
          <span className="ml-2 text-xs px-2 py-1 rounded bg-green-200 text-green-800">
            Free
          </span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => onAnalyze("gpt-4o")}>
          <span>Analyze with gpt-4o</span>
          <span className="ml-2 text-xs px-2 py-1 rounded bg-red-200 text-red-800">
            Paid
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AnalyzeDropdownButton;
