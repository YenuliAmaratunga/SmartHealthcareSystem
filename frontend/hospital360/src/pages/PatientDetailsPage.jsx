import { useLocation } from "react-router-dom";
import AppLayout from "../components/GenericComponents/AppLayout";
import { PatientDetailsCard } from "../components/PatientComponents/PatientDetailsCard";

export default function PatientDetailsPage() {
  const location = useLocation();
  const patient = location.state?.patient;

  return (
    <AppLayout>
      <div className="mt-6 max-w-6xl mx-auto space-y-6">
        {patient ? (
          <PatientDetailsCard patient={patient} />
        ) : (
          <p className="text-center text-red-600 mt-8">
            Patient data not found.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
