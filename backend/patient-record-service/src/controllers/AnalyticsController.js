import { Patient } from "../models/patientModel.js";
import { AccessLog } from "../models/accessLogModel.js";

// GET /api/patient/data/patients/all
export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({});
    if (!patients.length) return res.status(404).json({ message: "No patients found" });
    res.status(200).json(patients);
  } catch (err) {
    console.error("getAllPatients error:", err);
    res.status(500).json({ message: "Error fetching patients" });
  }
};

// GET /api/patient/data/accessLogs/all
export const getAllAccessLogs = async (req, res) => {
  try {
    const logs = await AccessLog.find({});
    if (!logs.length) return res.status(404).json({ message: "No access logs found" });
    res.status(200).json(logs);
  } catch (err) {
    console.error("getAllAccessLogs error:", err);
    res.status(500).json({ message: "Error fetching access logs" });
  }
};
