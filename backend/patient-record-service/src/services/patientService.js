import { Patient } from "../models/patientModel.js";
import { AccessLog } from "../models/accessLogModel.js";
import { generateQRCode } from "./qrService.js";

export const registerPatient = async (data, staffId) => {
  const patientId = `P${Date.now().toString().slice(-4)}`;
  const qrCode = await generateQRCode(patientId);

  const newPatient = new Patient({ patientId, qrCode, ...data });
  await newPatient.save();

  await AccessLog.create({
    staffId,
    patientId,
    accessType: "CREATE",
    status: "SUCCESS",
    message: "Patient registered successfully",
  });

  return newPatient;
};

export const findPatientByQR = async (qrData, staffId) => {
  const decoded = JSON.parse(qrData);
  const patient = await Patient.findOne(
    { patientId: decoded.patientId },
    "patientId name dob gender contact allergies medications appointments type"
  );

  await AccessLog.create({
    staffId,
    patientId: decoded.patientId,
    accessType: "SCAN",
    status: patient ? "SUCCESS" : "FAILED",
    message: patient ? "Record retrieved" : "Patient not found",
  });

  return patient;
};

// ⚙️ Temporary patient registration (A3 flow)
export const registerTemporaryPatient = async (data, staffId) => {
  const tempId = `TMP-${Date.now().toString().slice(-4)}`;
  const qrCode = await generateQRCode(tempId);

  const tempPatient = new Patient({
    patientId: tempId,
    qrCode,
    type: "TEMPORARY",
    ...data,
  });

  await tempPatient.save();

  await AccessLog.create({
    staffId,
    patientId: tempId,
    accessType: "TEMP_CREATE",
    status: "SUCCESS",
    message: "Temporary patient record created",
  });

  return tempPatient;
};

export const getRecentAccessLogs = async (limit = 10) => {
  return await AccessLog.find().sort({ timestamp: -1 }).limit(limit);
};

export const getPatientById = async (patientId, staffId) => {
  const patient = await Patient.findOne({ patientId });

  await AccessLog.create({
    staffId,
    patientId,
    accessType: "SCAN",
    status: patient ? "SUCCESS" : "FAILED",
    message: patient ? "Record retrieved manually" : "Patient not found",
  });

  return patient;
};
