import React, { useState } from "react";
import AppLayout from "../components/GenericComponents/AppLayout";
import ReportFilters from "../components/AnalyticsComponents/reportFilters";
import TotalsCards from "../components/AnalyticsComponents/totalsCards";
import { VisitsLine, RevenuePie, AgeBucketsBar, StaffBar } from "../components/AnalyticsComponents/charts";
import {
  fetchTotals, fetchVisitsByDay, fetchRevenueByDepartment,
  fetchAgeBuckets, fetchStaffActivity
} from "../api/analyticsApi";

const Banner = ({ type="error", children }) => (
  <div className={`p-3 rounded mb-4 ${type==="error" ? "bg-red-50 text-red-700 border border-red-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
    <b>{type === "error" ? "Analytics error:" : "Info:"}</b> {children}
  </div>
);

export default function AnalyticsDashboard() {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner]   = useState(null);

  // data
  const [totals, setTotals]   = useState(null);
  const [visits, setVisits]   = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [ages, setAges]       = useState({});
  const [staff, setStaff]     = useState({ byStaff: [], eventsByDay: [], failuresByType: [] });

  // per-widget error lines
  const [errVisits, setErrVisits]   = useState("");
  const [errRevenue, setErrRevenue] = useState("");
  const [errAges, setErrAges]       = useState("");
  const [errStaff, setErrStaff]     = useState("");

  const handleGenerate = async ({ type, from, to }) => {
    setBanner(null);
    setLoading(true);
    setErrVisits(""); setErrRevenue(""); setErrAges(""); setErrStaff("");

    const range = {};
    if (from) range.from = from;
    if (to)   range.to   = to;

    try {
      // totals always helpful for cards
      const t = await fetchTotals(range);
      setTotals(t);

      // fetch selectively
      if (type === "all" || type === "visits") {
        try { setVisits(await fetchVisitsByDay(range)); } catch (e) { console.error(e); setErrVisits("Failed to load visits."); }
      } else { setVisits([]); }

      if (type === "all" || type === "revenue") {
        try { setRevenue(await fetchRevenueByDepartment(range)); } catch (e) { console.error(e); setErrRevenue("Failed to load revenue."); }
      } else { setRevenue([]); }

      if (type === "all" || type === "ages") {
        try { setAges(await fetchAgeBuckets()); } catch (e) { console.error(e); setErrAges("Failed to load patient ages."); }
      } else { setAges({}); }

      if (type === "all" || type === "staff") {
        try { setStaff(await fetchStaffActivity(range)); } 
        catch (e) { console.error(e); setErrStaff("Failed to load staff activity."); }
      } else { setStaff({ byStaff: [], eventsByDay: [], failuresByType: [] }); }
    } catch (e) {
      console.error("[AnalyticsDashboard] fatal", e);
      setBanner("Something went wrong while generating the report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <ReportFilters onGenerate={handleGenerate} />
        {banner && <Banner>{banner}</Banner>}
        {loading && <Banner type="info">Loading, please wait…</Banner>}

        <TotalsCards totals={totals} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VisitsLine data={visits} error={errVisits} />
          <RevenuePie data={revenue} error={errRevenue} />
          <StaffBar data={staff.byStaff} error={errStaff} />
          <AgeBucketsBar data={ages} error={errAges} />
        </div>
      </div>
    </AppLayout>
  );
}
