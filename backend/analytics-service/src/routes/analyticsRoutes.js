import express from "express";
import { getTotals } from "../controllers/totalsController.js";
import { getVisitsByDay } from "../controllers/trendsController.js";
import {
  getAgeBuckets,
  getGenderDistribution,
  getBloodGroupDistribution,
  getPatientTypeDistribution,
} from "../controllers/distributionsController.js";
import {
  getAppointmentsByDepartment,
  getAppointmentsByDoctor,
  getPeakHours,  
  getRevenueByDepartment,
  getRevenueByDoctor
} from "../controllers/appointmentsController.js";
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
router.get("/appointments-by-department", getAppointmentsByDepartment); // ?from&to
router.get("/appointments-by-doctor", getAppointmentsByDoctor); // ?from&to&top=5
router.get("/peak-hours", getPeakHours);// ?from&to
router.get("/revenue-by-department", getRevenueByDepartment);
router.get("/revenue-by-doctor", getRevenueByDoctor);

// staff
router.get("/staff-activity", getStaffActivity);// ?from&to



export default router;
