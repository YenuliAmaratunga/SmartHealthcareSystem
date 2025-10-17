import axios from "axios";
import { ANALYTICS_API_BASE } from "./serviceEndpoints.js";

const asArray  = (x) => (Array.isArray(x) ? x : []);
const asObject = (x) => (x && typeof x === "object" && !Array.isArray(x) ? x : {});

const get = async (path, params = {}) => {
  const url = `${ANALYTICS_API_BASE}${path}`;
  const { data } = await axios.get(url, { params });
  // eslint-disable-next-line no-console
  console.debug(`[analyticsApi] GET ${url}`, params, "→", data);
  return data;
};

// cards
export const fetchTotals = async (q) => asObject(await get("/totals", q));

// trends
export const fetchVisitsByDay = async (q) => {
  const data = await get("/visits-by-day", q);
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    return Object.entries(data).map(([date, count]) => ({ date, count }));
  }
  return [];
};

// revenue
export const fetchRevenueByDepartment = async (q) => {
  const list = asArray(await get("/revenue-by-department", q));
  return list.map((r) => ({
    name: r?.name ?? "Unknown",
    amount: Number(r?.amount ?? r?.count ?? 0),
  }));
};

// distributions
export const fetchAgeBuckets             = async () => asObject(await get("/age-buckets"));
export const fetchGenderDistribution     = async () => asObject(await get("/gender-distribution"));
export const fetchPatientTypeDistribution= async () => asObject(await get("/patient-type"));
export const fetchBloodGroupDistribution = async () => asObject(await get("/bloodgroup-distribution"));

// staff
export const fetchStaffActivity = async (q) => {
  const raw = await get("/staff-activity", q);
  console.debug("[analyticsApi] staff-activity raw →", raw);

  if (Array.isArray(raw)) {
    return {
      byStaff: raw.map(r => ({ name:  r?.name || r?.staffId || "UNKNOWN", count: Number(r?.count || 0) })),
      eventsByDay: [],
      failuresByType: []
    };
  }

  const byStaff = (raw?.byStaff || []).map(r => ({
    name:  r?.staffId || r?.name || "UNKNOWN",
    count: Number(r?.count || 0),
  }));

  const eventsByDay = (raw?.eventsByDay || []).map(r => ({
    date: r?.date, count: Number(r?.count || 0)
  }));

  const failuresByType = (raw?.failuresByType || []).map(r => ({
    type: r?.type || "UNKNOWN", count: Number(r?.count || 0)
  }));

  return { byStaff, eventsByDay, failuresByType };
};

// appointments + peak hours
export const fetchAppointmentsByDepartment = async (q) => (await get("/appointments-by-department", q)) ?? [];
export const fetchPeakHours                = async (q) => (await get("/peak-hours", q)) ?? [];
