import { Routes, Route } from "react-router-dom";
import SchAppointments from "./pages/SchAppointments";
import AvailabilityResults from "./pages/AvailabilityResults";



export default function App() {
  return (
    <Routes>
     
      <Route path = "/scheduleAppointments" element = {<SchAppointments/>}/>
      <Route path="/availability" element = {<AvailabilityResults/>}/>
   
 
    </Routes>
  );
}
