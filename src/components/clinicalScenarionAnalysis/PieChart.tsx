import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#6FA3EF", "#A2D9CE", "#F7DC6F", "#F1948A", "#C39BD3"];

interface PieChartComponentProps {
  title: string;
  data: { name: string; value: number }[];
}

const PieChartComponent: React.FC<PieChartComponentProps> = ({
  title,
  data,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center bg-slate-100 p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-slate-700 mb-2">{title}</h3>
        <p className="text-slate-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-slate-100 p-2 rounded-lg shadow-md">
      <h3 className="text-sm font-bold text-slate-700 mb-2">{title}</h3>
      <PieChart width={250} height={250}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="horizontal"
          verticalAlign="bottom"
          align="center"
          wrapperStyle={{ fontSize: "10px" }}
        />
      </PieChart>
    </div>
  );
};

export default PieChartComponent;
