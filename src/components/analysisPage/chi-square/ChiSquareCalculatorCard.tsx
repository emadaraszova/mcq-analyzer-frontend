import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ChiSquareCalculatorCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/** --- Generic collapsible card wrapper for chi-square calculators --- **/
const ChiSquareCalculatorCard = ({
  title,
  subtitle,
  children,
}: ChiSquareCalculatorCardProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full bg-blue-50 border rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-slate-600">{subtitle}</p>
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

      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

export default ChiSquareCalculatorCard;
