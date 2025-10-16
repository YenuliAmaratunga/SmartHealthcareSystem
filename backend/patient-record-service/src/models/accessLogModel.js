import mongoose from "mongoose";

const accessLogSchema = new mongoose.Schema({
  staffId: String,
  patientId: String,
  accessType: { type: String, enum: ["CREATE", "SCAN", "TEMP_CREATE"], required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["SUCCESS", "FAILED"] },
  message: String,
});

export const AccessLog = mongoose.model("AccessLog", accessLogSchema);
