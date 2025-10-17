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

  // Format DOB to a more readable form
  const formattedDOB = patient.dob
    ? new Date(patient.dob).toLocaleDateString()
    : "N/A";

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-5xl mx-auto mt-8 border border-gray-200 transition-all hover:shadow-3xl">
      <div className="flex flex-col md:flex-row md:space-x-12">
        {/* --- Left side: Patient Info --- */}
        <div className="flex-1 space-y-6">
          {/* Header */}
          <div className="border-b pb-3 mb-4">
            <h2 className="text-3xl font-bold text-gray-800">{patient.name}</h2>
            <p className="text-gray-500 mt-1 text-sm">
              Patient Summary Information
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-4 text-gray-700">
            <InfoItem
              icon={<FaIdBadge />}
              label="Patient ID"
              value={patient.patientId}
            />
            <InfoItem
              icon={<FaVenusMars />}
              label="Gender"
              value={patient.gender}
            />
            <InfoItem
              icon={<FaPhone />}
              label="Contact"
              value={patient.contact}
            />
            <InfoItem
              icon={<FaUserShield />}
              label="Type"
              value={patient.type || "Regular"}
            />
            <InfoItem
              icon={<FaCalendarAlt />}
              label="Date of Birth"
              value={formattedDOB}
            />
            <InfoItem
              icon={<FaNotesMedical />}
              label="Blood Group"
              value={patient.bloodGroup}
            />
            <InfoItem
              icon={<FaMapMarkerAlt />}
              label="Address"
              value={patient.address}
            />

            {patient.allergies?.length > 0 && (
              <InfoItem
                icon={<FaPills />}
                label="Allergies"
                value={patient.allergies.join(", ")}
              />
            )}

            {patient.medications?.length > 0 && (
              <InfoItem
                icon={<FaPills />}
                label="Medications"
                value={patient.medications.join(", ")}
              />
            )}
          </div>

          {/* --- Appointments Section --- */}
          {patient.appointments?.length > 0 && (
            <div className="pt-6 border-t mt-6">
              <div className="flex items-center mb-2 text-gray-700">
                <FaClipboardList className="mr-2 text-gray-500" />
                <b>Appointments</b>
              </div>
              <ul className="list-disc ml-6 text-gray-600 space-y-1">
                {patient.appointments.map((appt, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{appt.date}</span> —{" "}
                    {appt.doctor} ({appt.department}) [{appt.status}]
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* --- Right side: QR Code --- */}
        {patient.qrCode && (
          <div className="flex-1 mt-10 md:mt-0 flex flex-col items-center justify-start md:justify-center border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-10">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-inner">
              <img
                src={patient.qrCode}
                alt="Patient QR"
                className="w-52 h-52 object-contain"
              />
            </div>
            <a
              href={patient.qrCode}
              download={`${patient.patientId}-QR.png`}
              className="mt-5 text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Download QR
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Reusable Info Item Component ---
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="mt-1 text-gray-500">{icon}</div>
      <div>
        <p className="text-sm text-gray-500 font-semibold">{label}</p>
        <p className="text-base text-gray-800 font-medium">{value || "—"}</p>
      </div>
    </div>
  );
}
