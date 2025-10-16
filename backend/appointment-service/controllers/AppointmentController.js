const BookDoctor = require('../models/BookDoctor');


exports.fetchAppointments = async(req,res)=>{

    try {
    const { patientId } = req.params;
    const appointments = await BookDoctor.find({ patient: patientId });

   

    if (appointments.length === 0) {
        return res.status(404).json({ message: "Appointments not found" });
    }

    return res.status(200).json(appointments);
} catch (err) {
    return res.status(500).json({ error: err.message });
}

}

exports.deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;

    const deleted = await BookDoctor.findByIdAndDelete(appointmentId);

    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
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

