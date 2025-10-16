import mongoose from "mongoose";

const reportLogSchema = new mongoose.Schema({
  type: { type: String, required: true },
  filters: { type: Object, default: {} },
  rowCount: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
});

export const ReportLog = mongoose.model("ReportLog", reportLogSchema);
