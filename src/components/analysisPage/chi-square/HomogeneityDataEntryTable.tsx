import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import Label from "@/components/common/Label";
import { HomogeneityDataEntryTableProps } from "@/types/analysisPage";

/** --- Data entry table for R×C contingency table --- **/
const HomogeneityDataEntryTable = ({
  rows,
  columnLabels,
  onChangeRowLabel,
  onChangeCell,
  onChangeColumnLabel,
  onAddRow,
  onRemoveRow,
  onAddColumn,
  onRemoveColumn,
}: HomogeneityDataEntryTableProps) => {
  const canRemoveRow = rows.length > 2;
  const canRemoveColumn = columnLabels.length > 2;

  return (
    <div className="bg-white border rounded-lg p-4">
      {/* Table label */}
      <Label
        htmlFor="homogeneity-table"
        text="Observed counts (R×C contingency table)"
      />

      <div className="mt-2 overflow-x-auto">
        <table
          id="homogeneity-table"
          className="w-full text-sm border-collapse"
        >
          <thead>
            <tr>
              <th className="p-2 text-left align-bottom">Group</th>
              {columnLabels.map((label, j) => (
                <th key={j} className="p-2 align-bottom">
                  <div className="flex items-center gap-1">
                    <Input
                      className="w-full"
                      value={label}
                      placeholder={`Category ${j + 1}`}
                      onChange={(e) => onChangeColumnLabel(j, e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveColumn(j)}
                      disabled={!canRemoveColumn}
                      title={
                        canRemoveColumn
                          ? "Remove column"
                          : "At least 2 columns required"
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </th>
              ))}
              <th className="p-2 text-right align-bottom">—</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {/* Row label */}
                <td className="p-2">
                  <Input
                    className="w-full"
                    value={row.rowLabel}
                    placeholder={`Group ${i + 1}`}
                    onChange={(e) => onChangeRowLabel(i, e.target.value)}
                  />
                </td>

                {/* Cells with observed counts */}
                {columnLabels.map((_, j) => (
                  <td key={j} className="p-2">
                    <Input
                      className="w-full"
                      inputMode="decimal"
                      placeholder="0"
                      value={row.values[j] ?? ""}
                      onChange={(e) =>
                        onChangeCell(
                          i,
                          j,
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </td>
                ))}

                {/* Remove row button */}
                <td className="p-2 text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveRow(i)}
                    disabled={!canRemoveRow}
                    title={
                      canRemoveRow ? "Remove row" : "At least 2 rows required"
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer with actions */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-xs text-slate-500">
          Rows represent groups/populations; columns represent outcome
          categories. Counts must be non-negative.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onAddRow}>
            Add row
          </Button>
          <Button variant="outline" onClick={onAddColumn}>
            Add column
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomogeneityDataEntryTable;
