import mongoose from "mongoose";

const reportLogSchema = new mongoose.Schema({
  format: { type: String, enum: ["pdf","xlsx"], required: true },
  sections: { type: [String], default: [] },  // e.g. ["totals","age-buckets"]
  filters: { type: Object, default: {} },     // { from, to, top }
  rowCount: { type: Number, default: 0 },
  generatedAt: { type: Date, default: Date.now }
});

export const ReportLog = mongoose.model("ReportLog", reportLogSchema);
