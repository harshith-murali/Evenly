"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Home", value: 38, color: "#cfe8ff" },
  { name: "Food", value: 26, color: "#cfeedd" },
  { name: "Travel", value: 22, color: "#f7d0b5" },
  { name: "Fun", value: 14, color: "#f8cfd8" }
];

export function CategoryChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer height="100%" width="100%">
        <PieChart>
          <Pie cx="50%" cy="50%" data={data} dataKey="value" innerRadius={54} outerRadius={88} paddingAngle={5}>
            {data.map((item) => (
              <Cell fill={item.color} key={item.name} stroke="#fbfaf7" strokeWidth={5} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
