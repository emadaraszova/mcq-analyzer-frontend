import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AnalyzeDropdownButtonProps {
  isResponseReady: boolean;
  onAnalyze: (model: string) => void;
}

const AnalyzeDropdownButton: React.FC<AnalyzeDropdownButtonProps> = ({
  isResponseReady,
  onAnalyze,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={!isResponseReady}>
         {"Analyze the text"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={() => {
            onAnalyze("gemini-2.5-flash");
          }}
        >
          <span>Analyze with gemini-2.5-flash</span>
          <span className="ml-2 text-xs px-2 py-1 rounded bg-green-200 text-green-800">
            Free
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            onAnalyze("gpt-4o");
          }}
        >
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
