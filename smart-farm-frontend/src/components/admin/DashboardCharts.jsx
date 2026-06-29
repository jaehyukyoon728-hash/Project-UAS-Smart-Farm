import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { MdKeyboardArrowDown } from "react-icons/md";

const monthlyData = [
  { month: "Jan", aktivitas: 42 }, { month: "Feb", aktivitas: 61 }, { month: "Mar", aktivitas: 71 },
  { month: "Apr", aktivitas: 80 }, { month: "May", aktivitas: 64 }, { month: "Jun", aktivitas: 55 },
  { month: "Jul", aktivitas: 50 }, { month: "Aug", aktivitas: 60 }, { month: "Sep", aktivitas: 74 },
  { month: "Oct", aktivitas: 85 }, { month: "Nov", aktivitas: 64 }, { month: "Dec", aktivitas: 50 },
];

const landStatusData = [
  { name: "Healthy", value: 50, color: "#4A8F70" },
  { name: "Critical", value: 30, color: "#E05252" },
  { name: "Maintenance", value: 20, color: "#F59E0B" },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-xs">
        <p className="font-bold text-gray-900">{label}</p>
        <p className="text-gray-500 mt-0.5">{payload[0].value} events</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 rounded-lg shadow-lg border border-gray-100 text-xs">
        <p className="font-bold text-gray-900">{payload[0].name}</p>
        <p className="text-gray-500 mt-0.5">{payload[0].value}%</p>
      </div>
    );
  }
  return null;
};

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize="12" fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function BarChartCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-[16px] font-bold text-gray-900">Monthly Irrigation Activity</h3>
        <button className="flex items-center gap-1 text-[13px] font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50">
          This Year <MdKeyboardArrowDown size={16} />
        </button>
      </div>
      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} barCategoryGap="20%" margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} dx={-10} />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(74, 143, 112, 0.05)" }} />
            <Bar dataKey="aktivitas" fill="#4A8F70" radius={[2, 2, 0, 0]} maxBarSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4">
         <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-[3px] bg-[#4A8F70]" />
            <span className="text-[12px] text-gray-500 font-medium">Irrigation Events</span>
         </div>
      </div>
    </div>
  );
}

export function PieChartCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] p-6 h-full flex flex-col">
      <h3 className="text-[16px] font-bold text-gray-900 mb-6">Land Status Distribution</h3>
      <div className="flex-1 flex items-center">
        <div className="w-[55%] h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={landStatusData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                stroke="white"
                strokeWidth={2}
                labelLine={false}
                label={renderCustomizedLabel}
              >
                {landStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-[45%] flex flex-col justify-center gap-4 pl-2">
           {landStatusData.map((item, i) => (
             <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}} />
                  <span className="text-[13px] font-medium text-gray-700">{item.name}</span>
                </div>
                <span className="text-[13px] font-bold text-gray-900">{item.value}%</span>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
