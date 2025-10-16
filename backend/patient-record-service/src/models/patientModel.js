import mongoose from "mongoose";

// Appointment sub-schema
const appointmentSchema = new mongoose.Schema({
  doctor: String,
  department: String,
  date: Date,
  status: String,
});

// Medical summary sub-schema
const medicalSummarySchema = new mongoose.Schema({
  condition: String,
  notes: String,
  lastUpdated: Date,
});

// Main patient schema
const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  name: { type: String, required: true },
  dob: Date,
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  contact: String,
  address: String,
  bloodGroup: {
    type: String,
    enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  },
  allergies: [String],
  medications: [String],
  medicalHistory: [medicalSummarySchema],
  appointments: [appointmentSchema],
  insuranceProvider: String,

  // Field specific to temporary patients
  reasonForVisit: { type: String, default: "" },

  type: { type: String, enum: ["REGULAR", "TEMPORARY"], default: "REGULAR" },

  qrCode: String,
  createdAt: { type: Date, default: Date.now },
});

// Export model
export const Patient = mongoose.model("Patient", patientSchema);
