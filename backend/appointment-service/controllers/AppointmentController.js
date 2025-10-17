const BookDoctor = require('../models/BookDoctor');
const DoctorMeetUps = require("../models/DoctorMeetups");
const dayjs = require("dayjs")


exports.fetchAppointments = async (req, res) => {
  try {
    const { patientId } = req.params;

    const appointments = await BookDoctor.find({ patient: patientId })
      .populate("doctor", "doctorName specialization email phone") // 👈 populate doctor details
      .sort({ sessionDate: 1 });

    if (!appointments || appointments.length === 0) {
      return res.status(404).json({ message: "No appointments found" });
    }

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    // 1️⃣ Find the appointment to get doctor and date info
    const appointment = await BookDoctor.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    const doctorId = appointment.doctor;
    const appointmentDate = appointment.sessionDate;
    const dayOfWeek = dayjs(appointmentDate).format("dddd"); // Monday, Tuesday, etc.

    // 2️⃣ Find the doctor's meetup document
    const doctorMeetup = await DoctorMeetUps.findOne({ doctorId });
    if (!doctorMeetup) {
      await BookDoctor.findByIdAndDelete(appointmentId);
      return res.status(404).json({
        message: "Doctor session not found, appointment deleted only.",
      });
    }

    // 3️⃣ Find matching session and increment availableSlots
    let slotUpdated = false;
    const sessionList = doctorMeetup.sessions[dayOfWeek];
    if (Array.isArray(sessionList)) {
      for (let session of sessionList) {
        const sameDate =
          dayjs(session.date).format("YYYY-MM-DD") ===
          dayjs(appointmentDate).format("YYYY-MM-DD");
        if (sameDate) {
          session.availableSlots = Math.min(
            session.availableSlots + 1,
            session.maxPatients
          );
          slotUpdated = true;
          break;
        }
      }
    }

    // 4️⃣ Save the updated doctor session
    if (slotUpdated) {
      await doctorMeetup.save();
    }

    // 5️⃣ Delete the appointment
    await BookDoctor.findByIdAndDelete(appointmentId);

    return res.status(200).json({
      message: `Appointment deleted successfully${
        slotUpdated ? " and slot updated" : ""
      }`,
    });
  } catch (err) {
    console.error("Error deleting appointment:", err);
    return res.status(500).json({ error: err.message });
  }
};


exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const updateData = req.body; 

    const updated = await BookDoctor.findByIdAndUpdate(
      appointmentId,
      updateData,
      { new: true } 
    );

    if (!updated) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({
      message: "Appointment updated successfully",
      appointment: updated
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


exports.fetchAllAppointments = async(req,res)=>{

  try{

    const appointments = await BookDoctor.find();
    if(appointments.length === 0) res.status(404).json('No any available appointments');
    return res.status(200).json(appointments);

  }catch(err){

    res.status(500).json("Internal Server Error Occured");

  }


}