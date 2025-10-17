import axios from "axios";
import { ANALYTICS_API_BASE } from "./serviceEndpoints.js";

// --- tiny helpers ---
const asArray  = (x) => (Array.isArray(x) ? x : []);
const asObject = (x) => (x && typeof x === "object" && !Array.isArray(x) ? x : {});

const get = async (path, params = {}) => {
  const url = `${ANALYTICS_API_BASE}${path}`;
  const { data } = await axios.get(url, { params });
  // dev logging to help diagnose fast
  // eslint-disable-next-line no-console
  console.debug(`[analyticsApi] GET ${url}`, params, "→", data);
  return data;
};

// cards
export const fetchTotals = async (q) => asObject(await get("/totals", q));

// trends
export const fetchVisitsByDay = async (q) => {
  const data = await get("/visits-by-day", q); // expected: [{ date, count }]
  // also accept { "2025-10-22": 5 } just in case
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    return Object.entries(data).map(([date, count]) => ({ date, count }));
  }
  return [];
};

// revenue
export const fetchRevenueByDepartment = async (q) => {
  const list = asArray(await get("/revenue-by-department", q)); // {name, amount} or {name, count}
  return list.map((r) => ({
    name: r?.name ?? "Unknown",
    amount: Number(r?.amount ?? r?.count ?? 0),
  }));
};

// distributions
export const fetchAgeBuckets = async () => asObject(await get("/age-buckets"));

// staff
export const fetchStaffActivity = async (q) => {
  const raw = await get("/staff-activity", q);
  console.debug("[analyticsApi] staff-activity raw →", raw);

  // Backward compatibility if BE ever returns an array
  if (Array.isArray(raw)) {
    return {
      byStaff: raw.map(r => ({
        name:  r?.name || r?.staffId || "UNKNOWN",
        count: Number(r?.count || 0),
      })),
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
