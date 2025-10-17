import { jest } from "@jest/globals";
import * as qrService from "../services/qrService.js";
import QRCode from "qrcode";

describe("qrService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate a QR code data URL for a patientId", async () => {
    const mockDataUrl = "data:image/png;base64,mocked";
    jest.spyOn(QRCode, "toDataURL").mockResolvedValue(mockDataUrl);
    const patientId = "P1234";
    const result = await qrService.generateQRCode(patientId);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      JSON.stringify({ patientId })
    );
    expect(result).toBe(mockDataUrl);
  });

  it("should throw if QRCode.toDataURL fails", async () => {
    jest.spyOn(QRCode, "toDataURL").mockRejectedValue(new Error("QR error"));
    await expect(qrService.generateQRCode("P5678")).rejects.toThrow("QR error");
  });

  it("should handle numeric patientId", async () => {
    const mockDataUrl = "data:image/png;base64,numeric";
    jest.spyOn(QRCode, "toDataURL").mockResolvedValue(mockDataUrl);
    const patientId = 12345;
    const result = await qrService.generateQRCode(patientId);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      JSON.stringify({ patientId })
    );
    expect(result).toBe(mockDataUrl);
  });

  it("should handle missing patientId (undefined)", async () => {
    const mockDataUrl = "data:image/png;base64,undefined";
    jest.spyOn(QRCode, "toDataURL").mockResolvedValue(mockDataUrl);
    const result = await qrService.generateQRCode(undefined);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(
      JSON.stringify({ patientId: undefined })
    );
    expect(result).toBe(mockDataUrl);
  });
});
