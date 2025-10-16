import { Routes, Route } from "react-router-dom";
import SchAppointments from "./pages/SchAppointments";
import AvailabilityResults from "./pages/AvailabilityResults";


import CheckInDashboard from "./pages/PatientCheckInDashboard";
import PatientDetailsPage from "./pages/PatientDetailsPage";
import RegisterPatientFormPage from "./pages/RegisterPatientFormPage";
import TemporaryPatientFormPage from "./pages/TemporaryPatientFormPage";


export default function App() {
  return (
    <Routes>
     
      <Route path = "/scheduleAppointments" element = {<SchAppointments/>}/>
      <Route path="/availability" element = {<AvailabilityResults/>}/>
   
 
    </Routes>
  );
}

