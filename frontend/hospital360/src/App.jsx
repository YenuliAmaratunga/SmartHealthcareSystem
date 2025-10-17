import { Routes, Route } from "react-router-dom";
import CheckInDashboard from "./pages/PatientCheckInDashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import RegisterPatientFormPage from "./pages/RegisterPatientFormPage";
import TemporaryPatientFormPage from "./pages/TemporaryPatientFormPage";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/patients" element={<CheckInDashboard />} />
      <Route path="/patients/:id" element={<PatientDetailsPage />} />
      <Route path="/patients/register-patient" element={<RegisterPatientFormPage />} />
      <Route path="/patients/register-temp-patient" element={<TemporaryPatientFormPage />} />
    </Routes>
  );
}

