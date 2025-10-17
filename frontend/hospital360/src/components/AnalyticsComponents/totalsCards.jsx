import React from "react";

const Card = ({ label, value }) => (
  <div className="bg-white shadow rounded-lg p-4 border-l-4 border-[#0fb5a3]">
    <div className="text-sm text-gray-500">{label}</div>
    <div className="text-2xl font-bold text-gray-800">{value}</div>
  </div>
);

const TotalsCards = ({ totals }) => {
  const t = totals || {};
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card label="Total Patients" value={t.totalPatients ?? "-"} />
      <Card label="Practitioners" value={t.totalPractitioners ?? "-"} />
      <Card label="Upcoming Appointments" value={t.upcomingAppointments ?? "-"} />
      <Card label="Scheduled Revenue (LKR)" value={t.scheduledRevenue ?? "-"} />
    </div>
  );
};

export default TotalsCards;
