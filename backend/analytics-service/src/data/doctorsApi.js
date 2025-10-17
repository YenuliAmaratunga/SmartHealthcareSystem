import axios from "axios";
import { DOCTOR_API_URL } from "../config/serviceConfig.js";

export async function getAllDoctors() {
  try {
    const res = await axios.get(`${DOCTOR_API_URL}/api/Doctors/viewDoctors`);
    const data = res.data;
    return Array.isArray(data) ? data : (Array.isArray(data?.doctors) ? data.doctors : []);
  } catch (e) {
    if (e.response?.status === 404) return [];
    throw e;
  }
}
