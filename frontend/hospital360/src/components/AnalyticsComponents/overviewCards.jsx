import React from "react";

const Card = ({ label, value, hint }) => (
  <div className="bg-white shadow rounded-lg p-4 border-l-4 border-[#0fb5a3]">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-gray-800">{value ?? "-"}</div>
    {!!hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
  </div>
);

export default function OverviewCards({ data }) {
  const {
    totals = {},
    checkins7d = 0,
    failures7d = 0,
    topDepartment = "-",
    peakHour = "-",
  } = data || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card label="Total Patients" value={totals.totalPatients} />
      <Card label="Active Practitioners" value={totals.totalPractitioners} />
      <Card label="Upcoming Appointments" value={totals.upcomingAppointments} />
      <Card label="Scheduled Revenue (LKR)" value={totals.scheduledRevenue} />
      <Card label="Check-ins (last 7 days)" value={checkins7d} />
      <Card label="Access Failures (last 7 days)" value={failures7d} />
      <Card label="Top Department" value={topDepartment} />
      <Card label="Peak Booking Hour (0–23)" value={peakHour} />
    </div>
  );
}
