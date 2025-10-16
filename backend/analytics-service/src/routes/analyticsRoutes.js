import express from "express";
import { getTotals } from "../controllers/totalsController.js";
import { getVisitsByDay } from "../controllers/trendsController.js";
import { getAgeBuckets } from "../controllers/distributionsController.js";

const router = express.Router();

// GET /api/analytics/totals
router.get("/totals", getTotals);
router.get("/visits-by-day", getVisitsByDay); //?from=YYYY-MM-DD&to=YYYY-MM-DD    
router.get("/age-buckets", getAgeBuckets)

export default router;
