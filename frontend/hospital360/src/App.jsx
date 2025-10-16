import { Routes, Route } from "react-router-dom";
import SchAppointments from "./pages/SchAppointments";
import AvailabilityResults from "./pages/AvailabilityResults";
import BookAppointment from "./pages/BookAppointment";



export default function App() {
  return (
    <Routes>
     
      <Route path = "/scheduleAppointments" element = {<SchAppointments/>}/>
      <Route path="/availability" element = {<AvailabilityResults/>}/>
      <Route path = "/book-appointment" element = {<BookAppointment/>}/>
   
 
    </Routes>
  );
}
