import { Routes, Route } from "react-router-dom";
import CheckInDashboard from "./pages/PatientCheckInDashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import RegisterPatientFormPage from "./pages/RegisterPatientFormPage";
import TemporaryPatientFormPage from "./pages/TemporaryPatientFormPage";

import AnalyticsDashboard from "./pages/analyticsDashboard"

import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/analytics" element={<AnalyticsDashboard />} />
    </Routes>
  );
}

