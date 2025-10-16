import QRCode from "qrcode";

export const generateQRCode = async (patientId) => {
  const qrData = { patientId };
  return await QRCode.toDataURL(JSON.stringify(qrData));
};
