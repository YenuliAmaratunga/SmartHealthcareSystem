import { getAllPatients } from "../data/patientsApi.js";

function toAge(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d)) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 140 ? age : null;
}

export async function getAgeBuckets(req, res) {
  try {
    const patients = await getAllPatients();

    const buckets = {
      "<18": 0,
      "18-29": 0,
      "30-44": 0,
      "45-59": 0,
      "60+": 0,
      "UNKNOWN": 0
    };

    for (const p of patients) {
      const age = toAge(p?.dob);
      if (age == null) { buckets.UNKNOWN++; continue; }
      if (age < 18) buckets["<18"]++;
      else if (age < 30) buckets["18-29"]++;
      else if (age < 45) buckets["30-44"]++;
      else if (age < 60) buckets["45-59"]++;
      else buckets["60+"]++;
    }

    res.status(200).json(buckets);
  } catch (err) {
    console.error("getAgeBuckets error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute age buckets" });
  }
}
