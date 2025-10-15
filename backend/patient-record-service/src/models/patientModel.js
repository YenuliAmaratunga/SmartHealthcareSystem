import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  doctor: String,
  department: String,
  date: Date,
  status: String,
});

const medicalSummarySchema = new mongoose.Schema({
  condition: String,
  notes: String,
  lastUpdated: Date,
});

const patientSchema = new mongoose.Schema({
  patientId: { type: String, unique: true },
  name: { type: String, required: true },
  dob: Date,
  gender: String,
  contact: String,
  address: String,
  bloodGroup: String,
  allergies: [String],
  medications: [String],
  medicalHistory: [medicalSummarySchema],
  appointments: [appointmentSchema],
  insuranceProvider: String,
  type: { type: String, enum: ["REGULAR", "TEMPORARY"], default: "REGULAR" },
  qrCode: String,
  createdAt: { type: Date, default: Date.now },
});

export const Patient = mongoose.model("Patient", patientSchema);
