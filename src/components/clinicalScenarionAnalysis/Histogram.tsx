import { useRef, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Copy, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { copyElementAsPng } from "@/utils/copyAsImage";
import { AgeHistogramProps } from "@/types/analyzedData";


const AgeHistogram = ({ ageData }: AgeHistogramProps) => {
  if (!ageData.length) {
    return <div className="text-center text-slate-500">No age data available</div>;
  }

  const minAge = Math.min(...ageData);
  const maxAge = Math.max(...ageData);
  const binSize = 5;
  const bins: Record<string, number> = {};

  for (let i = minAge; i <= maxAge; i += binSize) {
    bins[`${i}-${i + binSize - 1}`] = 0;
  }

  ageData.forEach((age) => {
    const start = Math.floor(age / binSize) * binSize;
    const binKey = `${start}-${start + binSize - 1}`;
    bins[binKey] = (bins[binKey] || 0) + 1;
  });

  const histogramData = Object.entries(bins).map(([range, count]) => ({
    range,
    count,
  }));

  const chartRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!chartRef.current) return;
    try {
      const result = await copyElementAsPng(chartRef.current, "age-histogram.png");
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

  return (
    <div className="bg-slate-100 rounded-lg shadow-md p-4 relative">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-700">Age Distribution</h2>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-sm border rounded-md px-2 py-1 bg-white hover:bg-slate-50"
          aria-label="Copy histogram as image"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Chart area */}
      <div ref={chartRef} className="bg-white rounded-md p-2">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={histogramData}
            margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          >
            <XAxis
              dataKey="range"
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
