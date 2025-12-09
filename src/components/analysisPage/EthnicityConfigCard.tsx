import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, ChevronUp, Trash, Plus } from "lucide-react";
import Label from "@/components/common/Label";
import {
  EthnicityCategoryConfig,
  EthnicityConfigCardProps,
} from "@/types/analysisPage";

/** Collapsible card for configuring ethnicity categories & matchers */
const EthnicityConfigCard = ({
  config,
  onChange,
}: EthnicityConfigCardProps) => {
  const [open, setOpen] = useState(false);

  // Local text buffer for each category's matchers
  const [draftText, setDraftText] = useState<Record<string, string>>({});

  // Initialize draft text when config changes
  useEffect(() => {
    setDraftText((prev) => {
      const next: Record<string, string> = { ...prev };
      config.forEach((cat) => {
        if (next[cat.id] === undefined) {
          next[cat.id] = cat.matchers.join(", ");
        }
      });
      return next;
    });
  }, [config]);

  const applyConfigChange = (next: EthnicityCategoryConfig[]) => {
    onChange(next);
  };

  const updateCategory = (
    id: string,
    patch: Partial<EthnicityCategoryConfig>
  ) => {
    applyConfigChange(
      config.map((c) => (c.id === id ? { ...c, ...patch } : c))
    );
  };

  // Parse matchers when leaving the input field
  const commitMatchersFromDraft = (id: string) => {
    const raw = draftText[id] ?? "";
    const matchers = raw
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    updateCategory(id, { matchers });
  };

  const handleDraftChange = (id: string, value: string) => {
    setDraftText((prev) => ({ ...prev, [id]: value }));
  };

  const addCategory = () => {
    const nextIndex = config.length + 1;
    const newCat: EthnicityCategoryConfig = {
      id: `cat-${Date.now()}`,
      label: `Category ${nextIndex}`,
      matchers: [],
    };
    applyConfigChange([...config, newCat]);
  };

  const removeCategory = (id: string) => {
    const cat = config.find((c) => c.id === id);
    const isFallback = !!cat?.isFallback;

    // Prevent deleting the fallback category and ensure at least one category remains
    if (config.length <= 1 || isFallback) return;

    applyConfigChange(config.filter((c) => c.id !== id));
  };

  // --- UI layout ---
  return (
    <div className="w-full bg-blue-50 border rounded-lg p-4">
      {/* Header with title and toggle button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ethnicity Categories</h3>
          <p className="text-sm text-slate-600">
            Define how raw ethnicity strings (e.g. "African American") are
            mapped to chart categories.
          </p>
        </div>

        <Button variant="outline" onClick={() => setOpen((prev) => !prev)}>
          {open ? (
            <ChevronUp className="mr-2 h-4 w-4" />
          ) : (
            <ChevronDown className="mr-2 h-4 w-4" />
          )}
          {open ? "Hide definitions" : "Show definitions"}
        </Button>
      </div>

      {open && (
        <div className="mt-4 space-y-3">
          {/* Helper text under header */}
          <p className="text-xs text-slate-500">
            Enter comma-separated keywords. A raw ethnicity value is assigned to
            the first category whose keywords match. Values that match no
            category fall into the fallback category.
          </p>

          {/* List of editable category blocks */}
          <div className="space-y-2">
            {config.map((cat) => {
              const isFallback = !!cat.isFallback;
              const canRemove = config.length > 1 && !isFallback;
              const matchersText = draftText[cat.id] ?? cat.matchers.join(", ");

              return (
                <div
                  key={cat.id}
                  className="bg-white border rounded-md p-3 flex flex-col gap-2"
                >
                  {/* Category label row (name + delete button) */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`cat-label-${cat.id}`} text="Category" />
                    <Input
                      id={`cat-label-${cat.id}`}
                      className="max-w-xs"
                      value={cat.label}
                      onChange={(e) =>
                        updateCategory(cat.id, { label: e.target.value })
                      }
                      placeholder="Category name"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(cat.id)}
                      disabled={!canRemove}
                      title={
                        !canRemove
                          ? "Cannot remove the fallback category"
                          : "Remove category"
                      }
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Keywords input row */}
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`cat-matchers-${cat.id}`} text="Keywords" />
                    <Input
                      id={`cat-matchers-${cat.id}`}
                      className="flex-1"
                      value={matchersText}
                      onChange={(e) =>
                        handleDraftChange(cat.id, e.target.value)
                      }
                      onBlur={() => commitMatchersFromDraft(cat.id)}
                      placeholder="e.g. white, caucasian"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add-category button at the bottom */}
          <Button variant="outline" onClick={addCategory}>
            <Plus className="h-4 w-4 mr-2" />
            Add category
          </Button>
        </div>
      )}
    </div>
  );
};

export default EthnicityConfigCard;
