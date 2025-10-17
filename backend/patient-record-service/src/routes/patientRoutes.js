import express from "express";
import { handleRegisterPatient, handleScanQRCode, handleRegisterTempPatient, handleGetAccessLogs, handleGetPatientById } from "../controllers/patientController.js";

const router = express.Router();

router.post("/register", handleRegisterPatient);
router.post("/scan", handleScanQRCode);
router.post("/register/temp", handleRegisterTempPatient); 
router.get("/logs", handleGetAccessLogs);
router.get("/by-id/:patientId", handleGetPatientById);


export default router;
