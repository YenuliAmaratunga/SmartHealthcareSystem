import express from "express";
import { getTotals } from "../controllers/totalsController.js";

const router = express.Router();

// GET /api/analytics/totals
router.get("/totals", getTotals);

export default router;
