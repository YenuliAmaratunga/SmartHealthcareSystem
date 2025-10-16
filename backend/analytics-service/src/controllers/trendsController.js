import { getAllAppointments } from "../data/appointmentsApi.js";

function ymd(date) {
  const d = new Date(date);
  if (Number.isNaN(d)) return null;
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function getVisitsByDay(req, res) {
  try {
    const { from, to } = req.query; // YYYY-MM-DD (optional)
    const appts = await getAllAppointments();

    // filter by range if provided
    const fromD = from ? new Date(from) : null;
    const toD   = to   ? new Date(to)   : null;

    const counts = new Map();
    for (const a of appts) {
      const key = ymd(a?.sessionDate);
      if (!key) continue;

      const d = new Date(key);
      if (fromD && d < fromD) continue;
      if (toD   && d > toD)   continue;

      counts.set(key, (counts.get(key) || 0) + 1);
    }

    // return sorted by date
    const result = [...counts.entries()]
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, count]) => ({ date, count }));

    res.status(200).json(result);
  } catch (err) {
    console.error("getVisitsByDay error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute visits by day" });
  }
}
