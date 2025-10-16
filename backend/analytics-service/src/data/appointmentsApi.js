import axios from "axios";
import { APPT_API_URL } from "../config/serviceConfig.js";

export async function getAllAppointments() {
  try {
    const { data } = await axios.get(`${APPT_API_URL}/api/Appointments/viewAllRequirements`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (e.response?.status === 404) return [];
    throw e;
  }
}
