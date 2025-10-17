import { Routes, Route } from "react-router-dom";
import CheckInDashboard from "./pages/PatientCheckInDashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import RegisterPatientFormPage from "./pages/RegisterPatientFormPage";
import TemporaryPatientFormPage from "./pages/TemporaryPatientFormPage";

import AnalyticsDashboard from "./pages/analyticsDashboard"
import AnalyticsOverview from "./pages/AnalyticsOverview";     
import ReportsList from "./pages/ReportsList"; 

import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/reports" element={<AnalyticsOverview/>} />
      <Route path="/allreports" element={<ReportsList/>} />
    </Routes>
  );
}

