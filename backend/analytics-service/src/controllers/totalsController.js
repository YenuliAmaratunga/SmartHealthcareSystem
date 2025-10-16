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
    const [patients, doctors, appts] = await Promise.all([
      getAllPatients(),
      getAllDoctors(),
      getAllAppointments(),
    ]);

    const now = new Date();
    const upcomingAppointments = appts.filter(a => {
      const d = a?.sessionDate ? new Date(a.sessionDate) : null;
      return d && d >= now;
    }).length;

    const scheduledRevenue = appts.reduce((sum, a) => sum + computeRevenue(a), 0);

    res.status(200).json({
      totalPatients: patients.length,
      totalPractitioners: doctors.length,
      upcomingAppointments,
      scheduledRevenue
    });
  } catch (err) {
    console.error("getTotals error:", err?.message || err);
    res.status(500).json({ message: "Failed to compute totals" });
  }
}
