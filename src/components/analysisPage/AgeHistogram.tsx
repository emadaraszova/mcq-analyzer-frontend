import { useRef, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { copyElementAsPng } from "@/utils/copyAsImage";
import { AgeHistogramProps } from "@/types/analysisPage";

/** --- Renders an age distribution histogram with copy/download support --- **/
const AgeHistogram = ({ ageData }: AgeHistogramProps) => {
  // --- Handle no data ---
  if (!ageData.length) {
    return (
      <div className="text-center text-slate-500">No age data available</div>
    );
  }

  // --- Build histogram bins (aligned, single set) ---
  const binSize = 5;
  const minAge = Math.min(...ageData);
  const maxAge = Math.max(...ageData);

  // Align to bin boundaries
  const start = Math.floor(minAge / binSize) * binSize; // inclusive
  const endExclusive = Math.ceil((maxAge + 1) / binSize) * binSize; // exclusive upper bound

  // Pre-build bins and ordered starts
  const bins: Record<string, number> = {};
  const starts: number[] = [];
  for (let s = start; s < endExclusive; s += binSize) {
    starts.push(s);
    bins[`${s}-${s + binSize - 1}`] = 0;
  }

  // Count ages without creating new keys
  ageData.forEach((age) => {
    const idx = Math.floor(((age - start) * 1.0) / binSize);
    const clampedIdx = Math.max(0, Math.min(idx, starts.length - 1));
    const s = starts[clampedIdx];
    const key = `${s}-${s + binSize - 1}`;
    bins[key] += 1;
  });

  // Build chart data in correct order
  const histogramData = starts.map((s) => ({
    range: `${s}-${s + binSize - 1}`,
    count: bins[`${s}-${s + binSize - 1}`],
  }));

  // --- Copy chart as image ---
  const chartRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!chartRef.current) return;
    try {
      const result = await copyElementAsPng(
        chartRef.current,
        "age-histogram.png"
      );
      if (result === "copied") {
        setCopied(true);
        toast.success("Chart copied to clipboard");
        setTimeout(() => setCopied(false), 1500);
      } else {
        toast("Chart downloaded (clipboard unsupported)");
      }
    } catch {
      toast.error("Couldn’t copy chart");
    }
  };

  // --- UI layout ---
  return (
    <div className="bg-slate-100 rounded-lg shadow-md p-4 relative">
      {/* Header with title + copy button */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-700">
          Age Distribution
        </h2>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-sm border rounded-md px-2 py-1 bg-white hover:bg-slate-50"
          aria-label="Copy histogram as image"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Chart container */}
      <div ref={chartRef} className="bg-white rounded-md p-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={histogramData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="range"
              interval={0} // show every tick; remove if crowded
              label={{
                value: "Age Range",
                position: "insideBottom",
                offset: -5,
              }}
            />
            <YAxis
              allowDecimals={false}
              label={{
                value: "Count",
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AgeHistogram;
