import express from "express";
import { handleRegisterPatient, handleScanQRCode, handleRegisterTempPatient } from "../controllers/patientController.js";

const router = express.Router();

router.post("/register", handleRegisterPatient);
router.post("/scan", handleScanQRCode);
router.post("/register/temp", handleRegisterTempPatient); // A3 flow

export default router;
