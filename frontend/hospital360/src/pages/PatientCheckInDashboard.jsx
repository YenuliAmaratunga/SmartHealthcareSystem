import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserClock, FaQrcode } from "react-icons/fa";
import AppLayout from "../components/GenericComponents/AppLayout";
import ScanQRCode from "../components/PatientComponents/ScanQRCode";

export default function CheckInDashboard() {
  const [patient, setPatient] = useState(null);
  const navigate = useNavigate();

  const cardClasses =
    "cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl text-white";

  return (
    <AppLayout>
      <div className="space-y-8 p-4">
        <h1 className="text-2xl font-bold text-center mb-6">
          🏥 Patient Check-in Portal
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Register Patient Card */}
          <div
            onClick={() => navigate("/patients/register-patient")}
            className={`${cardClasses} bg-gradient-to-r from-blue-500 to-blue-600 h-full`}
          >
            <FaUserPlus className="text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-center">
              Register Patient
            </h2>
          </div>

          {/* Register Temporary Patient Card */}
          <div
            onClick={() => navigate("/patients/register-temp-patient")}
            className={`${cardClasses} bg-gradient-to-r from-orange-400 to-orange-500 h-full`}
          >
            <FaUserClock className="text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-center">
              Register Temporary Patient
            </h2>
          </div>

          {/* Scan QR Card */}
          <div
            className={`${cardClasses} bg-gradient-to-r from-green-400 to-green-500 h-full`}
          >
            <FaQrcode className="text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-center mb-4">Scan QR</h2>
            <div className="w-full">
              <ScanQRCode onScanned={(data) => {
                setPatient(data);
                navigate(`/patients/${data.patientId}`, { state: { patient: data } });
              }} />
            </div>
          </div>
        </div>

        {/* Optional: show scanned patient info */}
        {patient && (
          <div className="mt-6 max-w-md mx-auto bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-center">
            <p className="text-green-700 font-semibold">
              Scanned Patient: {patient.name} (ID: {patient.patientId})
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
