import express from "express";
import { getAllPatients, getAllAccessLogs } from "../controllers/AnalyticsController.js";

const router = express.Router();

router.get("/patients/all", getAllPatients);
router.get("/accessLogs/all", getAllAccessLogs);

export default router;
