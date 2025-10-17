import axios from "axios";
import { PATIENT_API_URL } from "../config/serviceConfig.js";

export async function getAllPatients() {
  try {
    const { data } = await axios.get(`${PATIENT_API_URL}/api/patient/data/patients/all`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (e.response?.status === 404) return [];
    throw e;
  }
}

export async function getAllAccessLogs() {
  try {
    const { data } = await axios.get(`${PATIENT_API_URL}/api/patient/data/accessLogs/all`);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    if (e.response?.status === 404) return [];
    throw e;
  }
}
