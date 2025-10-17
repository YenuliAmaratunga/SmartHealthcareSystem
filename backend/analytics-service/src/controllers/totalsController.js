import { getAllPatients }    from "../data/patientsApi.js";
import { getAllAppointments } from "../data/appointmentsApi.js";
import { getAllDoctors }      from "../data/doctorsApi.js";

function asNumber(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}

function computeRevenue(appt) {
  const totalAmount = asNumber(appt?.totalAmount);
  if (totalAmount) return totalAmount;

  const doctorFee   = asNumber(appt?.doctorFee);
  const hospitalFee = asNumber(appt?.hospitalFee ?? 1500);
  const onlineFee   = asNumber(appt?.onlineBookingFee ?? 200);
  return doctorFee + hospitalFee + onlineFee;
}

export async function getTotals(req, res) {
  try {
    // NEW: optional range
    const { from, to } = req.query;
    const fromD = from ? new Date(from) : null;
    const toD   = to   ? new Date(to)   : null;

    const [patients, doctors, appts] = await Promise.all([
      getAllPatients(),
      getAllDoctors(),
      getAllAppointments(),
    ]);

    const inRange = (a) => {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      if (!d || Number.isNaN(d)) return false;
      if (fromD && d < fromD) return false;
      if (toD   && d > toD)   return false;
      return true;
    };

    // If a range is provided, only use appointments in that range
    const sourceAppts = (fromD || toD) ? appts.filter(inRange) : appts;

    const now = new Date();
    const upcomingAppointments = sourceAppts.filter(a => {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      return d && d >= now;
    }).length;

    const scheduledRevenue = sourceAppts.reduce((sum, a) => sum + computeRevenue(a), 0);

    return res.status(200).json({
      totalPatients: patients.length,        
      totalPractitioners: doctors.length,    
      upcomingAppointments,                  
      scheduledRevenue                      
    });
  } catch (err) {
    console.error("getTotals error:", err?.message || err);
    return res.status(500).json({ message: "Failed to compute totals" });
  }
}
