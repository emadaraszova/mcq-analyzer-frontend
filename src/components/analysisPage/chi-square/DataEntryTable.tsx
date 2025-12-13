import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import Label from "@/components/common/Label";
import { DataEntryTableProps } from "@/types/analysisPage";

/** --- Data entry table for observed/expected values (GoF) --- **/
const DataEntryTable = ({
  rows,
  onAddRow,
  onRemoveRow,
  onChangeRow,
}: DataEntryTableProps) => {
  /**
   * Observed counts:
   * - integers only
   * - allow empty string while editing
   */
  const allowDigitsOnly = (value: string) =>
    value === "" || /^\d+$/.test(value);

  /**
   * Expected counts:
   * - decimals allowed
   * - allow empty string while editing
   * - accept dot or comma as decimal separator
   */
  const allowDecimal = (value: string) =>
    value === "" || /^\d*([.,]\d*)?$/.test(value);

  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 font-semibold text-slate-700 mb-2">
        <div className="col-span-5">Category</div>
        <div className="col-span-3">Observed (freq)</div>
        <div className="col-span-3">Expected (freq)</div>
        <div className="col-span-1 text-right">—</div>
      </div>

      {/* Table rows */}
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-center mb-2">
          {/* Category name */}
          <Input
            className="col-span-5"
            placeholder={`Category ${i + 1}`}
            value={r.label}
            onChange={(e) => onChangeRow(i, { label: e.target.value })}
          />

          {/* Observed frequency (integers only) */}
          <Input
            className="col-span-3"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={String(r.observed ?? "")}
            onChange={(e) => {
              const v = e.target.value;
              if (!allowDigitsOnly(v)) return;
              onChangeRow(i, { observed: v });
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (text !== "" && !/^\d+$/.test(text)) e.preventDefault();
            }}
          />

          {/* Expected frequency (decimals allowed) */}
          <Input
            className="col-span-3"
            type="text"
            inputMode="decimal"
            pattern="[0-9]*[.,]?[0-9]*"
            placeholder="0"
            value={String(r.expected ?? "")}
            onChange={(e) => {
              const v = e.target.value;
              if (!allowDecimal(v)) return;
              onChangeRow(i, { expected: v });
            }}
            onPaste={(e) => {
              const text = e.clipboardData.getData("text");
              if (text !== "" && !/^\d*([.,]\d*)?$/.test(text)) {
                e.preventDefault();
              }
            }}
          />

          {/* Remove row button */}
          <div className="col-span-1 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemoveRow(i)}
              disabled={rows.length <= 2}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}

      {/* Footer with tip + add button */}
      <div className="flex items-center justify-between mt-3">
        <div className="text-xs text-slate-500 flex items-center">
          <Label htmlFor="tip" text="Tip:" />
          <span className="ml-1">
            Observed counts must be integers. Expected frequencies may be
            fractional and should sum to the total observed count.
          </span>
        </div>

        <Button variant="outline" onClick={onAddRow}>
          <Plus className="h-4 w-4 mr-2" /> Add row
        </Button>
      </div>
    </div>
  );
};

export default DataEntryTable;
