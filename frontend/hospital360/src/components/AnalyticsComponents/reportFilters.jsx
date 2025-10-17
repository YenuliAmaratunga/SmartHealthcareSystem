import React, { useState } from "react";

const TYPES = [
  { value: "all", label: "All" },
  { value: "visits", label: "Visits (line)" },
  { value: "revenue", label: "Revenue by Department (pie)" },
  { value: "ages", label: "Patient Ages (bars)" },
  { value: "staff", label: "Staff Utilization (bars)" },
];

const ReportFilters = ({ onGenerate }) => {
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [type, setType] = useState("all");

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Report Filters</h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Report Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={type}
            onChange={e=>setType(e.target.value)}
          >
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Start Date</label>
          <input type="date" className="w-full border rounded px-3 py-2"
                 value={from} onChange={e=>setFrom(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">End Date</label>
          <input type="date" className="w-full border rounded px-3 py-2"
                 value={to} onChange={e=>setTo(e.target.value)} />
        </div>

        <div className="flex items-end">
          <button
            onClick={()=>onGenerate({ type, from, to })}
            className="bg-[#0f4c81] hover:bg-[#0e3f6b] text-white px-4 py-2 rounded w-full"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportFilters;
