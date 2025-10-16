// src/controllers/staffController.js
import { getAllAccessLogs } from "../data/patientsApi.js";

function ymd(date) {
  const d = new Date(date);
  if (Number.isNaN(d)) return null;
  return d.toISOString().slice(0, 10);
}

export async function getStaffActivity(req, res) {
  try {
    const { from, to } = req.query;
    const fromD = from ? new Date(from) : null;
    const toD   = to   ? new Date(to)   : null;

    const logs = await getAllAccessLogs();

    const eventsByDay = new Map();
    const byStaff     = new Map();
    const failures    = new Map(); // by accessType

    for (const l of logs) {
      const ts = l?.timestamp || l?.createdAt;
      const day = ts ? ymd(ts) : null;
      if (!day) continue;

      const d = new Date(day);
      if (fromD && d < fromD) continue;
      if (toD   && d > toD)   continue;

      eventsByDay.set(day, (eventsByDay.get(day) || 0) + 1);
      const staff = l?.staffId || "UNKNOWN_STAFF";
      byStaff.set(staff, (byStaff.get(staff) || 0) + 1);

      if (l?.status === "FAILED") {
        const t = l?.accessType || "UNKNOWN";
        failures.set(t, (failures.get(t) || 0) + 1);
      }
    }

    const trend = [...eventsByDay.entries()]
      .sort((a,b)=> (a[0]<b[0]? -1:1))
      .map(([date, count]) => ({ date, count }));

    const perStaff = [...byStaff.entries()]
      .sort((a,b)=> b[1]-a[1])
      .map(([staffId, count]) => ({ staffId, count }));

    const failuresByType = [...failures.entries()]
      .sort((a,b)=> b[1]-a[1])
      .map(([type, count]) => ({ type, count }));

    res.status(200).json({ eventsByDay: trend, byStaff: perStaff, failuresByType });
  } catch (err) {
    console.error("getStaffActivity error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute staff activity" });
  }
}
