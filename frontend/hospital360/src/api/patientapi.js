import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api/patients", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Register a normal patient
export const registerPatient = async (data) => {
  try {
    const response = await api.post("/register", data);
    return response;
  } catch (err) {
    console.error("Error registering patient:", err);
    throw err;
  }
};

// Register a temporary patient
export const registerTempPatient = async (data) => {
  try {
    const response = await api.post("/register/temp", data);
    return response;
  } catch (err) {
    console.error("Error registering temporary patient:", err);
    throw err;
  }
};

// Scan QR code and return patient data
export const scanQRCode = async (qrData) => {
  try {
    const response = await api.post("/scan", { qrData });
    return response;
  } catch (err) {
    console.error("Error scanning QR code:", err);
    throw err;
  }
};

// Fetch recent access logs
export const getAccessLogs = () => api.get("/logs");
