import { ReportLog } from "../models/reportLogModel.js";

export async function createReportLog(req, res) {
  try {
    const { format, sections = [], filters = {}, rowCount = 0 } = req.body || {};
    if (!format) return res.status(400).json({ message: "format is required" });
    const doc = await ReportLog.create({ format, sections, filters, rowCount });
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Failed to save report log" });
  }
}

export async function getReportLogs(req, res) {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const logs = await ReportLog.find({}).sort({ generatedAt: -1 }).limit(limit).lean();
    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to load report logs" });
  }
}
