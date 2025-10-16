// src/controllers/appointmentsController.js
import { getAllAppointments } from "../data/appointmentsApi.js";
import { getAllDoctors } from "../data/doctorsApi.js";

// normalize either 'speacialization' (typo in model) or 'department'
function getDeptOrSpec(a) {
  return a?.speacialization || a?.department || "UNKNOWN";
}

function parseHourAny(sessionTime, sessionDate) {
  // sessionTime might be "09:30" OR "10:00 AM"
  if (typeof sessionTime === "string") {
    const t = sessionTime.trim();
    // 24h "HH:mm"
    const m24 = /^(\d{1,2}):(\d{2})$/.exec(t);
    if (m24) {
      const h = Number(m24[1]);
      return Number.isFinite(h) ? Math.max(0, Math.min(23, h)) : null;
    }
    // 12h "HH:MM AM/PM"
    const m12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(t);
    if (m12) {
      let h = Number(m12[1]);
      const ampm = m12[3].toUpperCase();
      if (ampm === "PM" && h !== 12) h += 12;
      if (ampm === "AM" && h === 12) h = 0;
      return Math.max(0, Math.min(23, h));
    }
  }
  // fallback: use hour from sessionDate if present
  if (sessionDate) {
    const d = new Date(sessionDate);
    if (!Number.isNaN(d)) return d.getHours();
  }
  return null;
}

export async function getAppointmentsByDepartment(req, res) {
  try {
    const { from, to } = req.query;
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;

    const appts = await getAllAppointments();
    const counts = new Map();

    for (const a of appts) {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      if (d) {
        if (fromD && d < fromD) continue;
        if (toD && d > toD) continue;
      }
      const key = getDeptOrSpec(a);
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    const result = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));

    res.status(200).json(result);
  } catch (err) {
    console.error("getAppointmentsByDepartment error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute appointments by department" });
  }
}

export async function getAppointmentsByDoctor(req, res) {
  try {
    const { from, to, top } = req.query;
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;
    const limit = top ? Number(top) : null;

    const [appts, doctors] = await Promise.all([getAllAppointments(), getAllDoctors()]);
    const nameById = new Map(doctors.map((d) => [String(d._id), d.doctorName]));

    const counts = new Map();
    for (const a of appts) {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      if (d) {
        if (fromD && d < fromD) continue;
        if (toD && d > toD) continue;
      }
      const id = a?.doctor ? String(a.doctor) : null;
      const key = (id && nameById.get(id)) || "UNKNOWN_DOCTOR";
      counts.set(key, (counts.get(key) || 0) + 1);
    }

    let result = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([doctor, count]) => ({ doctor, count }));

    if (limit && limit > 0) result = result.slice(0, limit);

    res.status(200).json(result);
  } catch (err) {
    console.error("getAppointmentsByDoctor error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute appointments by doctor" });
  }
}

export async function getPeakHours(req, res) {
  try {
    const { from, to } = req.query;
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;

    const appts = await getAllAppointments();
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const counts = Object.fromEntries(hours.map((h) => [h, 0]));

    for (const a of appts) {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      if (d) {
        if (fromD && d < fromD) continue;
        if (toD && d > toD) continue;
      }
      const h = parseHourAny(a?.sessionTime, a?.sessionDate);
      if (h != null) counts[h] += 1;
    }

    const result = hours.map((h) => ({ hour: h, count: counts[h] }));
    res.status(200).json(result);
  } catch (err) {
    console.error("getPeakHours error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute peak hours" });
  }
}

function asNumber(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}
function computeRevenue(a) {
  const totalAmount = asNumber(a?.totalAmount);
  if (totalAmount) return totalAmount;
  return (
    asNumber(a?.doctorFee) +
    asNumber(a?.hospitalFee ?? 1500) +
    asNumber(a?.onlineBookingFee ?? 200)
  );
}

export async function getRevenueByDepartment(req, res) {
  try {
    const { from, to } = req.query;
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;

    const appts = await getAllAppointments();
    const sums = new Map();

    for (const a of appts) {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      if (d) {
        if (fromD && d < fromD) continue;
        if (toD && d > toD) continue;
      }
      const key = getDeptOrSpec(a);
      sums.set(key, (sums.get(key) || 0) + computeRevenue(a));
    }

    const result = [...sums.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([name, amount]) => ({ name, amount }));

    res.status(200).json(result);
  } catch (err) {
    console.error("getRevenueByDepartment error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute revenue by department" });
  }
}

export async function getRevenueByDoctor(req, res) {
  try {
    const { from, to, top } = req.query;
    const fromD = from ? new Date(from) : null;
    const toD = to ? new Date(to) : null;
    const limit = top ? Number(top) : null;

    const [appts, doctors] = await Promise.all([getAllAppointments(), getAllDoctors()]);
    const nameById = new Map(doctors.map((d) => [String(d._id), d.doctorName]));

    const sums = new Map();
    for (const a of appts) {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      if (d) {
        if (fromD && d < fromD) continue;
        if (toD && d > toD) continue;
      }
      const id = a?.doctor ? String(a.doctor) : null;
      const key = (id && nameById.get(id)) || "UNKNOWN_DOCTOR";
      sums.set(key, (sums.get(key) || 0) + computeRevenue(a));
    }

    let result = [...sums.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([doctor, amount]) => ({ doctor, amount }));

    if (limit && limit > 0) result = result.slice(0, limit);

    res.status(200).json(result);
  } catch (err) {
    console.error("getRevenueByDoctor error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute revenue by doctor" });
  }
}
