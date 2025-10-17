import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/GenericComponents/AppLayout";
import ReportFiltersMulti from "../components/AnalyticsComponents/reportFiltersMulti";
import OverviewCards from "../components/AnalyticsComponents/overviewCards";
import ActivityList from "../components/AnalyticsComponents/activityList";
import ErrorBoundary from "../components/AnalyticsComponents/errorBoundary";
import {
  VisitsLine, RevenuePie, AgeBucketsBar, StaffBar,
  GenderPie, PatientTypeBar, BloodGroupBar,
  AppointmentsByDeptBar, PeakHoursBar
} from "../components/AnalyticsComponents/charts";
import {
  fetchTotals, fetchVisitsByDay, fetchRevenueByDepartment, fetchAgeBuckets,
  fetchStaffActivity, fetchAppointmentsByDepartment, fetchPeakHours,
  fetchGenderDistribution, fetchPatientTypeDistribution, fetchBloodGroupDistribution
} from "../api/analyticsApi";
import { exportSectionsToPdf } from "../utils/pdfExport";
import { saveReport } from "../utils/reportRegistry";

const ALL_TYPES = [
  "visits","revenue","appointments","peakHours",
  "ages","gender","patientType","bloodGroup","staff"
];

export default function AnalyticsOverview() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState({ from: "", to: "" });
  const [types, setTypes] = useState([]);   // derived from single dropdown

  // data buckets
  const [totals, setTotals] = useState({});
  const [visits, setVisits] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [ages, setAges] = useState({});
  const [gender, setGender] = useState({});
  const [patientType, setPatientType] = useState({});
  const [bloodGroup, setBloodGroup] = useState({});
  const [staff, setStaff] = useState({ byStaff: [], eventsByDay: [], failuresByType: [] });
  const [byDept, setByDept] = useState([]);
  const [peak, setPeak] = useState([]);

  const [extraCards, setExtraCards] = useState({
    checkins7d: 0, failures7d: 0, topDepartment: "-", peakHour: "-"
  });

  async function generate({ type, from, to }) {
    setLoading(true);
    setRange({ from, to });
    const selected = type === "all" ? ALL_TYPES : [type];
    setTypes(selected);

    try {
      // Always totals
      const T = await fetchTotals({ from, to });
      setTotals(T || {});

      // Use locals to avoid stale state while computing KPIs
      let V = [], R = [], A = {}, G = {}, PT = {}, BG = {};
      let S = { byStaff: [], eventsByDay: [], failuresByType: [] };
      let DEP = [], H = [];

      const jobs = [];

      if (selected.includes("visits"))       jobs.push(fetchVisitsByDay({ from, to }).then(x => { V = x; }));
      if (selected.includes("revenue"))      jobs.push(fetchRevenueByDepartment({ from, to }).then(x => { R = x; }));
      if (selected.includes("ages"))         jobs.push(fetchAgeBuckets().then(x => { A = x; }));
      if (selected.includes("gender"))       jobs.push(fetchGenderDistribution().then(x => { G = x; }));
      if (selected.includes("patientType"))  jobs.push(fetchPatientTypeDistribution().then(x => { PT = x; }));
      if (selected.includes("bloodGroup"))   jobs.push(fetchBloodGroupDistribution().then(x => { BG = x; }));

      // Always fetch these three so KPI cards are right (even if not charted)
      jobs.push(fetchStaffActivity({ from, to }).then(x => { S = x || S; }));
      jobs.push(fetchAppointmentsByDepartment({ from, to }).then(x => { DEP = x || []; }));
      jobs.push(fetchPeakHours({ from, to }).then(x => { H = x || []; }));

      await Promise.all(jobs);

      // Commit state once
      setVisits(V); setRevenue(R); setAges(A); setGender(G); setPatientType(PT);
      setBloodGroup(BG); setStaff(S); setByDept(DEP); setPeak(H);

      // KPIs from fresh locals
      const checkins7d = (Array.isArray(S?.eventsByDay) ? S.eventsByDay : [])
        .slice(-7).reduce((a,b)=>a+(Number(b?.count)||0),0);
      const failures7d = (Array.isArray(S?.failuresByType) ? S.failuresByType : [])
        .reduce((a,b)=>a+(Number(b?.count)||0),0);

      const topDepartment = (() => {
        if (!Array.isArray(DEP) || DEP.length === 0) return "-";
        const max = DEP.reduce((m, d) =>
          (Number(d?.count) > Number(m?.count || -1) ? d : m), null);
        return max?.name || "-";
      })();

      const peakHour = (() => {
        if (!Array.isArray(H) || H.length === 0) return "-";
        const max = H.reduce((m, h) =>
          (Number(h?.count) > Number(m?.count || -1) ? h : m), null);
        return max ? max.hour : "-";
      })();

      setExtraCards({ checkins7d, failures7d, topDepartment, peakHour });
    } catch (e) {
      console.error("[Overview] generate error", e);
      alert("Unable to load analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function downloadSelectedPdf() {
    // Grab whatever is currently visible in the print area
    const container = document.getElementById("print-area");
    const ids = container
      ? Array.from(container.querySelectorAll('[id^="sec-"]')).map(el => el.id)
      : [];

    if (ids.length === 0) {
      alert("No charts to export. Generate a report first.");
      return;
    }

    try {
      const title = "Analytics Report";
      const dataUrl = await exportSectionsToPdf({ ids, title, meta: range });

      // Save to history
      saveReport({ title, filters: range, sections: ids, dataUrl });

      // Download NOW (no navigation)
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `analytics_${new Date().toISOString().slice(0,10)}.pdf`;
      a.click();
    } catch (e) {      
      console.error("[Overview] pdf error", e);
      alert("Download failed. Please try again.");
    }
  }

  return (
    <AppLayout>
      <ErrorBoundary>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Analytics Dashboard</h1>
            <div className="space-x-3">
              {/* App.jsx maps report history to /allreports */}
              <button
                type="button"
                onClick={() => nav("/allreports")}
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
              >
                View All Reports
              </button>
              <button
                type="button"
                onClick={downloadSelectedPdf}
                className="px-4 py-2 rounded bg-[#0f4c81] text-white hover:bg-[#0e3f6b]"
              >
                Download Report (PDF)
              </button>
            </div>
          </div>

          <ReportFiltersMulti onGenerate={generate} />

          <OverviewCards data={{ totals: totals || {}, ...extraCards }} />

          {/* Only render selected charts; each component already exposes a stable sec-* id */}
          <div id="print-area" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {types.includes("visits")       && <VisitsLine data={visits} />}
            {types.includes("revenue")      && <RevenuePie data={revenue} />}
            {types.includes("appointments") && <AppointmentsByDeptBar data={byDept} />}
            {types.includes("peakHours")    && <PeakHoursBar data={peak} />}
            {types.includes("staff")        && <StaffBar data={staff.byStaff} />}
            {types.includes("ages")         && <AgeBucketsBar data={ages} />}
            {types.includes("gender")       && <GenderPie data={gender} />}
            {types.includes("patientType")  && <PatientTypeBar data={patientType} />}
            {types.includes("bloodGroup")   && <BloodGroupBar data={bloodGroup} />}
          </div>

          {types.includes("staff") && <ActivityList days={staff.eventsByDay || []} />}

          {loading && <div className="text-sm text-gray-600">Loading, please wait…</div>}
        </div>
      </ErrorBoundary>
    </AppLayout>
  );
}
