import React from "react";
import dayjs from "dayjs";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, BarChart, Bar, Legend,
} from "recharts";

const COLORS = ["#0fb5a3","#0f4c81","#7c3aed","#f59e0b","#ef4444","#10b981","#3b82f6"];

const EmptyState = ({ text="No data in range." }) => (
  <div className="h-56 flex items-center justify-center text-gray-500 text-sm">{text}</div>
);

/* ---------- base charts (now carry stable sec-* IDs) ---------- */

export const VisitsLine = ({ data, error }) => {
  const list = Array.isArray(data) ? data : [];
  // ensure ascending date order so the line isn’t a single dot if BE returns mixed order
  const rows = [...list]
    .sort((a,b)=> String(a?.date ?? "").localeCompare(String(b?.date ?? "")))
    .map(d => ({ x: dayjs(d.date).format("MMM DD"), y: Number(d.count) || 0 }));

  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-visits">
      <h3 className="font-semibold mb-2">Patient Visits</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" /><YAxis allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="y" stroke="#0f4c81" />
        </LineChart>
      </ResponsiveContainer>}
    </div>
  );
};

export const RevenuePie = ({ data, error }) => {
  const list = Array.isArray(data) ? data : [];
  const rows = list.map((r, i) => ({
    name: r?.name ?? "Unknown",
    value: Number(r?.amount) || 0,   // expects analyticsApi to map amount/count correctly
    fill: COLORS[i % COLORS.length],
  }));
  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-revenue">
      <h3 className="font-semibold mb-2">Revenue Distribution</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" label>
            {rows.map((r, i) => <Cell key={i} fill={r.fill} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>}
    </div>
  );
};

export const AgeBucketsBar = ({ data, error }) => {
  const obj  = data && typeof data === "object" && !Array.isArray(data) ? data : {};
  const rows = Object.entries(obj).map(([bucket, count]) => ({ bucket, count: Number(count) || 0 }));
  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-ages">
      <h3 className="font-semibold mb-2">Patient Ages</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bucket" /><YAxis allowDecimals={false} />
          <Tooltip /><Legend />
          <Bar dataKey="count" fill="#0fb5a3" />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
};

export const StaffBar = ({ data, error }) => {
  const list = Array.isArray(data) ? data : [];
  const rows = list.map(r => ({ name: r?.name ?? "Unknown", count: Number(r?.count) || 0 }));
  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-staff">
      <h3 className="font-semibold mb-2">Staff Utilization</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" /><YAxis allowDecimals={false} />
          <Tooltip /><Legend />
          <Bar dataKey="count" fill="#0f4c81" />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
};

/* ---------- additional charts (already had stable IDs) ---------- */

export const GenderPie = ({ data, error }) => {
  const obj = data && typeof data === "object" ? data : {};
  const entries = Object.entries(obj).map(([name, v]) => ({ name, value: Number(v)||0 }));
  const rows = entries.map((r,i)=>({ ...r, fill: COLORS[i%COLORS.length]}));

  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-gender">
      <h3 className="font-semibold mb-2">Gender Distribution</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie data={rows} dataKey="value" nameKey="name" label>
            {rows.map((r,i)=><Cell key={i} fill={r.fill}/>)}
          </Pie>
          <Tooltip/>
        </PieChart>
      </ResponsiveContainer>}
    </div>
  );
};

export const PatientTypeBar = ({ data, error }) => {
  const obj  = data && typeof data === "object" ? data : {};
  const rows = Object.entries(obj).map(([type,count])=>({ type, count:Number(count)||0 }));
  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-patientType">
      <h3 className="font-semibold mb-2">Patient Type Distribution</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="type" /><YAxis allowDecimals={false} />
          <Tooltip /><Legend />
          <Bar dataKey="count" fill="#0f4c81" />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
};

export const BloodGroupBar = ({ data, error }) => {
  const obj  = data && typeof data === "object" ? data : {};
  const rows = Object.entries(obj).map(([bg,count])=>({ bg, count:Number(count)||0 }));
  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-bloodGroup">
      <h3 className="font-semibold mb-2">Blood Group Distribution</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="bg" /><YAxis allowDecimals={false} />
          <Tooltip /><Legend />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
};

export const AppointmentsByDeptBar = ({ data, error }) => {
  const list = Array.isArray(data) ? data : [];
  const rows = list.map(r=>({ name: r?.name||"Unknown", count:Number(r?.count||0) }));
  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-appointments">
      <h3 className="font-semibold mb-2">Appointments by Department</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" /><YAxis allowDecimals={false} />
          <Tooltip /><Legend />
          <Bar dataKey="count" fill="#7c3aed" />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
};

export const PeakHoursBar = ({ data, error }) => {
  const list = Array.isArray(data) ? data : [];
  const rows = list.map(r=>({ hour: String(r?.hour ?? "-"), count:Number(r?.count||0) }));
  return (
    <div className="bg-white rounded-lg shadow p-4" id="sec-peakHours">
      <h3 className="font-semibold mb-2">Peak Booking Hours</h3>
      {error ? <div className="text-red-600 text-sm">{error}</div> :
      rows.length === 0 ? <EmptyState/> :
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={rows}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="hour" /><YAxis allowDecimals={false} />
          <Tooltip /><Legend />
          <Bar dataKey="count" fill="#f59e0b" />
        </BarChart>
      </ResponsiveContainer>}
    </div>
  );
};
