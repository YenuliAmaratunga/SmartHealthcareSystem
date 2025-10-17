import { Routes, Route } from "react-router-dom";

// Patient Check-In Routes
import CheckInDashboard from "./pages/PatientCheckInDashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import RegisterPatientFormPage from "./pages/RegisterPatientFormPage";
import TemporaryPatientFormPage from "./pages/TemporaryPatientFormPage";

import AnalyticsDashboard from "./pages/analyticsDashboard"
import AnalyticsOverview from "./pages/AnalyticsOverview";     
import ReportsList from "./pages/ReportsList"; 

import Home from "./pages/Home";
// Appointment Routes
import SchAppointments from "./pages/SchAppointments";
import AvailabilityResults from "./pages/AvailabilityResults";
import BookAppointment from "./pages/BookAppointment";
import AppointmentsList from "./pages/AppointmentsList";


// Payment Module Routes
import BillsAndPaymentsPage from "./pages/BillsAndPaymentsPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/analytics" element={<AnalyticsDashboard />} />
      <Route path="/reports" element={<AnalyticsOverview/>} />
      <Route path="/allreports" element={<ReportsList/>} />
      
      {/* Patient Check-In Routes */}
      <Route path="/check-in" element={<CheckInDashboard />} />
      <Route path="/patient-details/:id" element={<PatientDetailsPage />} />
      <Route path="/patients/register-patient" element={<RegisterPatientFormPage />} />
      <Route path="/patients/register-temp-patient" element={<TemporaryPatientFormPage />} />

      {/* Appointment Routes */}
      <Route path="/scheduleAppointments" element={<SchAppointments />} />
      <Route path="/availability" element={<AvailabilityResults />} />
      <Route path="/book-appointment" element={<BookAppointment />} />
      <Route path="/appointments" element = {<AppointmentsList/>}/>
    
     

      {/* Payment Routes */}
      <Route path="/bills-and-payments" element={<BillsAndPaymentsPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/payment-failure" element={<PaymentFailurePage />} />
    </Routes>
  );
}

