import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaUserClock, FaQrcode, FaChevronDown, FaChevronUp, FaClock } from "react-icons/fa";
import AppLayout from "../components/GenericComponents/AppLayout";
import ScanQRCode from "../components/PatientComponents/ScanQRCode";
import RecentAccessLogs from "../components/PatientComponents/RecentAccessLogs";

export default function CheckInDashboard() {
  const [patient, setPatient] = useState(null);
  const [showLogs, setShowLogs] = useState(false);
  const navigate = useNavigate();

  const cardClasses =
    "cursor-pointer rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg transition-transform transform hover:-translate-y-1 hover:shadow-2xl text-white";

  return (
    <AppLayout>
      <div className="space-y-8 p-4">
        {/* --- Header --- */}
        <h1 className="text-2xl font-bold text-center mb-6">
          🏥 Patient Check-in Portal
        </h1>

        {/* --- Dashboard Action Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Register Patient */}
          <div
            onClick={() => navigate("/patients/register-patient")}
            className={`${cardClasses} bg-gradient-to-r from-blue-500 to-blue-600 h-full`}
          >
            <FaUserPlus className="text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-center">
              Register Patient
            </h2>
          </div>

          {/* Register Temporary Patient */}
          <div
            onClick={() => navigate("/patients/register-temp-patient")}
            className={`${cardClasses} bg-gradient-to-r from-orange-400 to-orange-500 h-full`}
          >
            <FaUserClock className="text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-center">
              Register Temporary Patient
            </h2>
          </div>

          {/* Scan QR */}
          <div
            className={`${cardClasses} bg-gradient-to-r from-green-400 to-green-500 h-full`}
          >
            <FaQrcode className="text-5xl mb-4" />
            <h2 className="text-xl font-semibold text-center mb-4">Scan QR</h2>
            <div className="w-full">
              <ScanQRCode
                onScanned={(data) => {
                  setPatient(data);
                  navigate(`/patients/${data.patientId}`, {
                    state: { patient: data },
                  });
                }}
              />
            </div>
          </div>
        </div>

        {/* --- Scanned Patient Info --- */}
        {patient && (
          <div className="mt-6 max-w-md mx-auto bg-white p-4 rounded-2xl shadow-md border border-gray-200 text-center">
            <p className="text-green-700 font-semibold">
              Scanned Patient: {patient.name} (ID: {patient.patientId})
            </p>
          </div>
        )}

        {/* --- Recent Access Logs Section --- */}
        <div className="mt-10 bg-gray-50 rounded-2xl shadow-inner p-6 transition-all duration-300">
          {/* Header with Collapse Button */}
          <div
            className="flex justify-between items-center cursor-pointer mb-4"
            onClick={() => setShowLogs(!showLogs)}
          >
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-700 text-lg" />
              <h2 className="text-lg font-semibold text-gray-800">
                Recent Access Logs
              </h2>
            </div>

            <button
              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 transition"
            >
              {showLogs ? (
                <>
                  <span>Hide</span> <FaChevronUp />
                </>
              ) : (
                <>
                  <span>View</span> <FaChevronDown />
                </>
              )}
            </button>
          </div>

          {/* Collapsible Content */}
          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              showLogs ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <RecentAccessLogs />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
