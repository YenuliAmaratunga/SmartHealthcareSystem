import express from "express";
import { getTotals } from "../controllers/totalsController.js";
import { getVisitsByDay } from "../controllers/trendsController.js";
import {
  getAgeBuckets,
  getGenderDistribution,
  getBloodGroupDistribution,
  getPatientTypeDistribution
} from "../controllers/distributionsController.js";
import {
  getBookingsByDepartment,
  getBookingsByDoctor,
  getPeakHours
} from "../controllers/bookingsController.js";
import { getStaffActivity } from "../controllers/staffController.js";

const router = express.Router();

// cards
router.get("/totals", getTotals);

// trends
router.get("/visits-by-day", getVisitsByDay);  // ?from&to

// distributions
router.get("/age-buckets", getAgeBuckets);
router.get("/gender-distribution", getGenderDistribution);
router.get("/bloodgroup-distribution", getBloodGroupDistribution);
router.get("/patient-type", getPatientTypeDistribution);

// bookings
router.get("/bookings-by-department", getBookingsByDepartment); // ?from&to
router.get("/bookings-by-doctor", getBookingsByDoctor);         // ?from&to&top=5
router.get("/peak-hours", getPeakHours);                        // ?from&to

// staff
router.get("/staff-activity", getStaffActivity);                // ?from&to

export default router;
