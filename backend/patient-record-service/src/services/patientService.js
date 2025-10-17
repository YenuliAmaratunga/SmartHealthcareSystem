import { Patient } from "../models/patientModel.js";
import { AccessLog } from "../models/accessLogModel.js";
import { generateQRCode } from "./qrService.js";

// Helpers to allow tests to inject mocks via global.__TEST_MOCKS__
const getPatientModel = () =>
  (global.__TEST_MOCKS__ && global.__TEST_MOCKS__.Patient) || Patient;
const getAccessLogModel = () =>
  (global.__TEST_MOCKS__ && global.__TEST_MOCKS__.AccessLog) || AccessLog;
const getGenerateQRCode = () =>
  (global.__TEST_MOCKS__ && global.__TEST_MOCKS__.generateQRCode) ||
  generateQRCode;

export const registerPatient = async (data, staffId) => {
  const patientId = `P${Date.now().toString().slice(-4)}`;
  const qrCode = await getGenerateQRCode()(patientId);

  const PatientModel = getPatientModel();
  const newPatient = new PatientModel({ patientId, qrCode, ...data });
  await newPatient.save();

  const AccessLogModel = getAccessLogModel();
  await AccessLogModel.create({
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
  const PatientModel2 = getPatientModel();
  const patient = await PatientModel2.findOne({ patientId: decoded.patientId });

  const AccessLogModel2 = getAccessLogModel();
  await AccessLogModel2.create({
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
  const qrCode = await getGenerateQRCode()(tempId);

  const PatientModel3 = getPatientModel();
  const tempPatient = new PatientModel3({
    patientId: tempId,
    qrCode,
    type: "TEMPORARY",
    ...data,
  });

  await tempPatient.save();

  const AccessLogModel3 = getAccessLogModel();
  await AccessLogModel3.create({
    staffId,
    patientId: tempId,
    accessType: "TEMP_CREATE",
    status: "SUCCESS",
    message: "Temporary patient record created",
  });

  return tempPatient;
};

export const getRecentAccessLogs = async (limit = 10) => {
  const AccessLogModel4 = getAccessLogModel();
  return await AccessLogModel4.find().sort({ timestamp: -1 }).limit(limit);
};

export const getPatientById = async (patientId, staffId) => {
  const PatientModel5 = getPatientModel();
  const patient = await PatientModel5.findOne({ patientId });

  const AccessLogModel5 = getAccessLogModel();
  await AccessLogModel5.create({
    staffId,
    patientId,
    accessType: "SCAN",
    status: patient ? "SUCCESS" : "FAILED",
    message: patient ? "Record retrieved manually" : "Patient not found",
  });

  return patient;
};
