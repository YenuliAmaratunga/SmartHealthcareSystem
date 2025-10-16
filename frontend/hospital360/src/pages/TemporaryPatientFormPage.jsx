import AppLayout from "../components/GenericComponents/AppLayout";
import TemporaryPatientForm from "../components/PatientComponents/TemporaryPatientForm";

export default function TemporaryPatientFormPage() {
  return (
    <AppLayout>
      <div className="mt-6 max-w-3xl mx-auto">
        <TemporaryPatientForm />
      </div>
    </AppLayout>
  );
}
