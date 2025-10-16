import { registerPatient, findPatientByQR, registerTemporaryPatient, getRecentAccessLogs  } from "../services/patientService.js";

export const handleRegisterPatient = async (req, res) => {
  try {
    const staffId = req.user?.id || "STF-001"; // mock for dev
    const patient = await registerPatient(req.body, staffId);
    res.status(201).json(patient);
  } catch (error) {
    console.error("Error registering patient:", error);
    res.status(500).json({ message: "Error registering patient" });
  }
};


export const handleRegisterTempPatient = async (req, res) => {
  try {
    const staffId = req.user?.id || "STF-001";
    const tempPatient = await registerTemporaryPatient(req.body, staffId);
    res.status(201).json(tempPatient);
  } catch (error) {
    console.error("Error registering temporary patient:", error);
    res.status(500).json({ message: "Error registering temporary patient" });
  }
};

export const handleScanQRCode = async (req, res) => {
  try {
    const { qrData } = req.body;
    const staffId = req.user?.id || "STF-001";
    const patient = await findPatientByQR(qrData, staffId);

    if (!patient)
      return res.status(404).json({ message: "Patient not found" });

    res.status(200).json(patient);
  } catch (error) {
    console.error("Error scanning QR code:", error);
    res.status(500).json({ message: "Error scanning QR code" });
  }
};

export const handleGetAccessLogs = async (req, res) => {
  try {
    const logs = await getRecentAccessLogs();
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching access logs:", error);
    res.status(500).json({ message: "Error fetching access logs" });
  }
};

