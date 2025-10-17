import { Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import SchAppointments from "./pages/SchAppointments";
import AvailabilityResults from "./pages/AvailabilityResults";

=======
>>>>>>> origin/develop
import CheckInDashboard from "./pages/PatientCheckInDashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import RegisterPatientFormPage from "./pages/RegisterPatientFormPage";
import TemporaryPatientFormPage from "./pages/TemporaryPatientFormPage";
import SchAppointments from "./pages/SchAppointments";
import AvailabilityResults from "./pages/AvailabilityResults";
import BookAppointment from "./pages/BookAppointment";

// Payment Module Routes
import BillsAndPaymentsPage from "./pages/BillsAndPaymentsPage";
import PaymentPage from "./pages/PaymentPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import PaymentFailurePage from "./pages/PaymentFailurePage";

export default function App() {
  return (
    <Routes>
<<<<<<< HEAD
      {/* Appointment Routes */}
      <Route path="/scheduleAppointments" element={<SchAppointments />} />
      <Route path="/availability" element={<AvailabilityResults />} />

      {/* Patient Check-In Routes */}
      <Route path="/check-in" element={<CheckInDashboard />} />
      <Route path="/patient-details/:id" element={<PatientDetailsPage />} />
      <Route path="/register-patient" element={<RegisterPatientFormPage />} />
      <Route path="/temporary-patient" element={<TemporaryPatientFormPage />} />

      {/* Payment Routes */}
      <Route path="/bills-and-payments" element={<BillsAndPaymentsPage />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/payment-failure" element={<PaymentFailurePage />} />
=======
   
      <Route path = "/scheduleAppointments" element = {<SchAppointments/>}/>
      <Route path="/availability" element = {<AvailabilityResults/>}/>
      <Route path = "/book-appointment" element = {<BookAppointment/>}/>
   
>>>>>>> origin/develop
    </Routes>
  );
}

