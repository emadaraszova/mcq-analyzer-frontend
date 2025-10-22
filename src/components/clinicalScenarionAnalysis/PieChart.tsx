import { useRef, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Copy, Check } from "lucide-react";
import { copyElementAsPng } from "@/utils/copyAsImage";
import { toast } from "react-hot-toast";
import { PieChartComponentProps } from "@/types/analysisPage";

const COLORS = ["#6FA3EF", "#A2D9CE", "#F7DC6F", "#F1948A", "#C39BD3"];


const PieChartComponent = ({ title, data }: PieChartComponentProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center bg-slate-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-700 mb-2">{title}</h3>
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  const chartRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!chartRef.current) return;
    try {
      const result = await copyElementAsPng(chartRef.current, `${title || "pie"}.png`);
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
    <div className="bg-slate-50 rounded-xl shadow-sm p-3 flex flex-col items-stretch relative">
      {/* Header row */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-xs border rounded-md px-2 py-1 bg-white hover:bg-slate-50"
          aria-label="Copy pie chart as image"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* Chart area */}
      <div ref={chartRef} className="bg-white rounded-md flex justify-center items-center p-2">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            strokeWidth={1}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: "10px", marginTop: "-5px" }}
          />
        </PieChart>
      </div>
    </div>
  );
}

export default PieChartComponent;