import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import Label from "@/components/common/Label";
import { DataEntryTableProps } from "@/types/analysisPage";

/** --- Data entry table for observed/expected values --- **/
const DataEntryTable = ({
  rows,
  entryMode,
  onAddRow,
  onRemoveRow,
  onChangeRow,
}: DataEntryTableProps) => {
  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Table header */}
      <div className="grid grid-cols-12 gap-2 font-semibold text-slate-700 mb-2">
        <div className="col-span-5">Category</div>
        <div className="col-span-3">Observed (freq)</div>
        <div className="col-span-3">
          {entryMode === "expected-freq"
            ? "Expected (freq)"
            : "Expected (prob)"}
        </div>
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

          {/* Observed frequency */}
          <Input
            className="col-span-3"
            inputMode="decimal"
            placeholder="0"
            value={r.observed}
            onChange={(e) =>
              onChangeRow(i, {
                observed: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
          />

          {/* Expected frequency or probability */}
          <Input
            className="col-span-3"
            inputMode="decimal"
            placeholder={entryMode === "expected-freq" ? "0" : "0–1"}
            value={r.expected}
            onChange={(e) =>
              onChangeRow(i, {
                expected: e.target.value === "" ? "" : Number(e.target.value),
              })
            }
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
            Expected values must be &gt; 0. In freq mode they must sum to the
            total observed; in prob mode they must sum to 1.
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
