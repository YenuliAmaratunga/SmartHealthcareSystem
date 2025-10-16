
import AppLayout from "../components/GenericComponents/AppLayout";
import RegisterPatientForm from "../components/PatientComponents/RegisterPatientForm";

export default function RegisterPatientFormPage() {
  return (
    <AppLayout>
      <RegisterPatientForm onRegistered={() => {}} />
    </AppLayout>
  );
}
