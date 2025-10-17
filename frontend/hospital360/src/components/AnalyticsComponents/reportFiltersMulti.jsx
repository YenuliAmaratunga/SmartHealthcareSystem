import React, { useState } from "react";

const OPTIONS = [
  { value: "all",          label: "All" },
  { value: "visits",       label: "Patient Visits" },
  { value: "revenue",      label: "Revenue by Department" },
  { value: "appointments", label: "Appointments by Department" },
  { value: "peakHours",    label: "Peak Booking Hours" },
  { value: "ages",         label: "Patient Age Distribution" },
  { value: "gender",       label: "Gender Distribution" },
  { value: "patientType",  label: "Patient Type Distribution" },
  { value: "bloodGroup",   label: "Blood Group Distribution" },
  { value: "staff",        label: "Staff Utilization" },
];

export default function ReportFiltersMulti({ onGenerate }) {
  const [from, setFrom] = useState("");
  const [to, setTo]     = useState("");
  const [type, setType] = useState("all");

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Report Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Report Type</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={type}
            onChange={e => setType(e.target.value)}
          >
            {OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
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
            type="button"
            onClick={() => onGenerate({ type, from, to })}
            className="bg-[#0f4c81] hover:bg-[#0e3f6b] text-white px-4 py-2 rounded w-full"
          >
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
