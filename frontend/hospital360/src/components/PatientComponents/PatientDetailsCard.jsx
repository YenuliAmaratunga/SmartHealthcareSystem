import {
  FaVenusMars,
  FaIdBadge,
  FaPhone,
  FaUserShield,
  FaCalendarAlt,
  FaNotesMedical,
  FaMapMarkerAlt,
  FaPills,
  FaClipboardList,
} from "react-icons/fa";

export function PatientDetailsCard({ patient }) {
  if (!patient) return null;

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 max-w-5xl mx-auto mt-6 border border-gray-200">
      <div className="flex flex-col md:flex-row md:space-x-10">
        {/* Left side: Patient Info */}
        <div className="flex-1 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">{patient.name}</h2>

          <div className="space-y-2 text-gray-700">
            <div className="flex items-center space-x-2">
              <FaIdBadge className="text-gray-500" />
              <span><b>Patient ID:</b> {patient.patientId}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaVenusMars className="text-gray-500" />
              <span><b>Gender:</b> {patient.gender}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaPhone className="text-gray-500" />
              <span><b>Contact:</b> {patient.contact}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaUserShield className="text-gray-500" />
              <span><b>Type:</b> {patient.type || "Regular"}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaCalendarAlt className="text-gray-500" />
              <span><b>Date of Birth:</b> {patient.dob}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaNotesMedical className="text-gray-500" />
              <span><b>Blood Group:</b> {patient.bloodGroup}</span>
            </div>

            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-gray-500" />
              <span><b>Address:</b> {patient.address}</span>
            </div>

            {patient.allergies?.length > 0 && (
              <div className="flex items-center space-x-2">
                <FaPills className="text-gray-500" />
                <span><b>Allergies:</b> {patient.allergies.join(", ")}</span>
              </div>
            )}

            {patient.medications?.length > 0 && (
              <div className="flex items-center space-x-2">
                <FaPills className="text-gray-500" />
                <span><b>Medications:</b> {patient.medications.join(", ")}</span>
              </div>
            )}

            {patient.appointments?.length > 0 && (
              <div className="flex items-start space-x-2">
                <FaClipboardList className="text-gray-500 mt-1" />
                <div>
                  <b>Appointments:</b>
                  <ul className="list-disc ml-6">
                    {patient.appointments.map((appt, idx) => (
                      <li key={idx}>
                        {appt.date} - {appt.doctor} ({appt.department}) [{appt.status}]
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: QR Code */}
        {patient.qrCode && (
          <div className="flex-1 mt-6 md:mt-0 flex flex-col items-center justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-10">
            <img
              src={patient.qrCode}
              alt="Patient QR"
              className="w-48 h-48 object-contain"
            />
            <a
              href={patient.qrCode}
              download={`${patient.patientId}-QR.png`}
              className="mt-4 text-blue-600 underline hover:text-blue-700"
            >
              Download QR
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
