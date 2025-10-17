import { jest } from "@jest/globals";
import * as patientService from "../services/patientService.js";
import { Patient } from "../models/patientModel.js";
import { AccessLog } from "../models/accessLogModel.js";
import * as qrService from "../services/qrService.js";

jest.mock("../models/patientModel.js", () => ({
  __esModule: true,
  Patient: jest.fn(() => ({
    save: jest.fn().mockResolvedValue({}),
  })),
}));

jest.mock("../models/accessLogModel.js", () => ({
  __esModule: true,
  AccessLog: {
    create: jest.fn().mockResolvedValue({}),
    find: jest.fn(() => ({
      sort: () => ({
        limit: (n) => [{}, {}],
      }),
    })),
  },
}));

jest.mock("../services/qrService.js", () => ({
  __esModule: true,
  generateQRCode: jest.fn().mockResolvedValue("mocked-qr"),
}));

describe("patientService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findPatientByQR", () => {
    it("logs failed access if patient not found", async () => {
      Patient.findOne = jest.fn().mockResolvedValue(null);
      AccessLog.create = jest.fn().mockResolvedValue({});
      const qrData = JSON.stringify({ patientId: "P9999" });
      const staffId = "STF-003";
      const result = await patientService.findPatientByQR(qrData, staffId);
      expect(AccessLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          staffId,
          patientId: "P9999",
          accessType: "SCAN",
          status: "FAILED",
        })
      );
      expect(result).toBeNull();
    });
  });

  describe("getRecentAccessLogs", () => {
    it("returns recent access logs", async () => {
      const logs = [{}, {}];
      AccessLog.find = jest.fn(() => ({ sort: () => ({ limit: () => logs }) }));
      const result = await patientService.getRecentAccessLogs(2);
      expect(AccessLog.find).toHaveBeenCalled();
      expect(result).toEqual(logs);
    });
  });

  describe("getPatientById", () => {
    it("logs failed access if patient not found", async () => {
      Patient.findOne = jest.fn().mockResolvedValue(null);
      AccessLog.create = jest.fn().mockResolvedValue({});
      const staffId = "STF-006";
      const result = await patientService.getPatientById("P0000", staffId);
      expect(AccessLog.create).toHaveBeenCalledWith(
        expect.objectContaining({
          staffId,
          patientId: "P0000",
          accessType: "SCAN",
          status: "FAILED",
        })
      );
      expect(result).toBeNull();
    });
  });
});
