import { useState, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { scanQRCode } from "../../api/patientapi";
import { useNavigate } from "react-router-dom";
import jsQR from "jsqr";

export default function ScanQRCode({ onScanned }) {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  // Camera scan handler
  const handleScan = async (detectedCodes) => {
    if (!detectedCodes || detectedCodes.length === 0 || scanned) return;

    setScanned(true);
    const qrValue = detectedCodes[0].rawValue;

    await handleQRCode(qrValue);
  };

  // Handle uploaded image
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) handleQRCode(code.data);
        else setError("No QR code found in the image");
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Common QR code handler
  const handleQRCode = async (qrValue) => {
    try {
      const res = await scanQRCode(qrValue);
      onScanned(res.data);
      navigate(`/patients/${res.data.patientId}`, { state: { patient: res.data } });
      setError("");
    } catch (err) {
      console.error(err);
      setError("Patient not found — try registering temporary.");
    } finally {
      setTimeout(() => setScanned(false), 2000);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <h2 className="text-lg font-semibold">Scan Patient QR</h2>

      {/* Camera Scanner */}
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden w-64 h-64">
        <Scanner
          onScan={handleScan}
          onError={(err) => console.error(err)}
          constraints={{ facingMode: "environment" }}
          scanDelay={500}
        />
      </div>

      {/* Upload QR image */}
      <div className="mt-2">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0 file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white hover:file:bg-blue-700"
        />
      </div>

      {error && <p className="text-red-600 text-center">{error}</p>}
    </div>
  );
}
