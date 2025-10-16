
const DocorMeetups = require('../models/DoctorMeetups');
const Doctor = require('../models/Doctor');
const BookDoctor = require('../models/BookDoctor');


exports.addDoctorSession = async(req , res)=>{

    try{

        const{doctorId,sessions} = req.body;
        const newDoctorMeetups = new DocorMeetups({
            doctorId : doctorId,
            sessions : sessions
        });

        const response = await newDoctorMeetups.save();
        if(!response) res.status(400).json({message : "Error Occured in Saving Doctors"});
        res.status(201).json({message : `Session Added Successfully under the Doctor ${doctorId}`})

    }catch(err){

        res.status(500).json(err);

    }
};

exports.readSessionByDoctorName = async(req , res)=>{

    try{

        const{doctorName} = req.params;
        const doctor = await Doctor.findOne({ doctorName: { $regex: doctorName, $options: "i" } });
        if(!doctor) res.status(404).json({message : `No any doctors found under the name ${doctorName}`});
        const session = await DocorMeetups.find({ doctorId: doctor._id });
        if(session.length === 0) res.status(404).json({message : `No sessions found under ${doctorName}`});
        return res.status(201).json(session);
       

    }catch(err){

        res.status(500).json(err);

    }
}



exports.readSessionBySpecialization = async (req, res) => {
  try {
    const { specialization } = req.params;


    const doctors = await Doctor.find({
      specialization: { $regex: specialization, $options: "i" }
    });

    if (doctors.length === 0) {
      return res.status(404).json({
        message: `No doctors found under specialization: ${specialization}`
      });
    }


    const doctorSessions = await Promise.all(
      doctors.map(async (doctor) => {
        const meetups = await DocorMeetups.find({ doctorId: doctor._id });

        return {
          doctor: {
            _id: doctor._id,
            name: doctor.doctorName,
            specialization: doctor.specialization,
            email: doctor.email,
            phone: doctor.phone
          },
          sessions: meetups.map((m) => m.sessions)
        };
      })
    );

   
    return res.status(200).json({
      message: `Sessions fetched successfully for specialization: ${specialization}`,
      data: doctorSessions
    });

  } catch (err) {
    return res.status(500).json({
      message: "Server error while fetching doctor sessions",
      error: err.message
    });
  }
};

exports.querySessions = async (req, res) => {
  try {
    const { name, specialization, time, date } = req.query;

    if (!name && !specialization && !time && !date) {
      return res.status(400).json({ message: "Please enter at least one filter to search." });
    }

    const doctorFilter = {};
    if (name) doctorFilter.doctorName = { $regex: name, $options: "i" };
    if (specialization) doctorFilter.specialization = { $regex: specialization, $options: "i" };

    const doctors = await Doctor.find(doctorFilter, "_id doctorName specialization");
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No matching doctors found" });
    }

    const doctorIds = doctors.map((doc) => doc._id);
    const meetups = await DocorMeetups.find({ doctorId: { $in: doctorIds } })
      .populate("doctorId", "doctorName specialization");

    if (!meetups.length) {
      return res.status(404).json({ message: "No sessions found for selected doctors" });
    }

    const filteredResults = [];
    const allSessions = [];

    meetups.forEach((meetup) => {
      const sessionsByDay = meetup.sessions || {};
      Object.keys(sessionsByDay).forEach((day) => {
        sessionsByDay[day].forEach((session) => {
          const sessionData = {
            doctorName: meetup.doctorId.doctorName,
            specialization: meetup.doctorId.specialization,
            day,
            date: session.date,
            startTime: session.startTime,
            endTime: session.endTime,
            maxPatients: session.maxPatients,
            availableSlots: session.availableSlots,
          };

          allSessions.push(sessionData);

          // Apply filters only for requested date/time
          let isMatch = true;
          if (date) {
            const sessionDate = new Date(session.date).toISOString().split("T")[0];
            const inputDate = new Date(date).toISOString().split("T")[0];
            if (sessionDate !== inputDate) isMatch = false;
          }

          if (time) {
            const inputTime = time;
            if (!(inputTime >= session.startTime && inputTime <= session.endTime)) {
              isMatch = false;
            }
          }

          if (isMatch) filteredResults.push(sessionData);
        });
      });
    });

    // ✅ Always return 200 — even if no sessions match the filters
    return res.status(200).json({
      results: filteredResults, // sessions for requested date/time
      otherSessions: allSessions, // all sessions for that doctor
      message:
        filteredResults.length > 0
          ? "Matching sessions found."
          : "Doctor not available on the selected date. Showing other sessions.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};




exports.reserveSlot = async (req, res) => {
  try {
    const { doctorId, date, time, patient } = req.body;

    // 1. Find doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // 2. Find doctor's sessions
    const doctorMeetup = await DocorMeetups.findOne({ doctorId });
    if (!doctorMeetup) return res.status(404).json({ message: "No sessions found for this doctor" });

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
    const sessions = doctorMeetup.sessions[dayOfWeek];
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: `No sessions found for ${dayOfWeek}` });
    }

    // 3. Helper to convert session time to minutes
    const toMinutes = (t) => {
      if (!t) return null;
      const [timePart, modifier] = t.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const requestedMinutes = toMinutes(time); // reuse same parser as session times


    // 4. Find matching session
    const session = sessions.find(s => {
      const sessionDate = new Date(s.date).toISOString().slice(0, 10);
      const sessionStart = toMinutes(s.startTime);
      const sessionEnd = toMinutes(s.endTime);
      return sessionDate === new Date(date).toISOString().slice(0, 10) &&
             requestedMinutes >= sessionStart &&
             requestedMinutes <= sessionEnd;
    });

    if (!session) return res.status(404).json({ message: "No matching session found for given date/time" });

    // 5. Check available slots
    if (!session.availableSlots || session.availableSlots <= 0) {
      return res.status(400).json({ message: "No available slots left" });
    }

    // 6. Decrement slots
    session.availableSlots -= 1;

    const parseTimeToMinutes = (timeStr) => {
  // timeStr example: "10:00 AM"
  const [timePart, modifier] = timeStr.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;
  return { hours, minutes };
};


    // 7. Calculate session time dynamically
    const getSessionTime = (session) => {
  const { hours: startHours, minutes: startMinutes } = parseTimeToMinutes(session.startTime);
  const slotDuration = session.slotDuration || 15;
  const patientIndex = session.maxPatients - session.availableSlots - 1; // 0-based
  const totalMinutes = startHours * 60 + startMinutes + patientIndex * slotDuration;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}`;
};


    const sessionTime = getSessionTime(session);
    const appointmentNumber = session.maxPatients - session.availableSlots;

    // 8. Calculate fees
    const hospitalFee = doctor.hospitalFee || 1500;
    const onlineBookingFee = doctor.onlineBookingFee || 200;
    const totalAmount = Number(doctor.doctorFee) + hospitalFee + onlineBookingFee;

    // 9. Create appointment
    const appointment = new BookDoctor({
      patient,
      doctor: doctorId,
      speacialization: doctor.specialization,
      doctorFee: doctor.doctorFee,
      sessionDate: new Date(session.date),
      sessionTime,
      hospitalFee,
      onlineBookingFee,
      totalAmount,
      apointmentNumber: appointmentNumber
    });

    await appointment.save();
    await doctorMeetup.save(); // Save updated slots

    return res.status(200).json({
      message: "Slot reserved successfully",
      doctor: doctor.doctorName,
      date,
      time,
      remainingSlots: session.availableSlots,
      appointmentNumber,
      totalAmount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error reserving slot",
      error: err.message
    });
  }
};



exports.fetchByNameAndSpecialization = async (req, res) => {
  try {
 
    const { doctorName, specialization } = req.query;

    if (!doctorName && !specialization) {
      return res
        .status(400)
        .json({ message: "Please provide doctor name or specialization." });
    }

    // Build filter for Doctor model
    const doctorFilter = {};
    if (doctorName) doctorFilter.doctorName = { $regex: doctorName, $options: "i" };
    if (specialization)
      doctorFilter.specialization = { $regex: specialization, $options: "i" };

    // Find doctors
    const doctors = await Doctor.find(
      doctorFilter,
      "_id doctorName specialization"
    );

    if (!doctors.length) {
      return res.status(404).json({ message: "No matching doctors found." });
    }

    const doctorIds = doctors.map((doc) => doc._id);

    // Find all sessions for those doctors
    const meetups = await DocorMeetups.find({
      doctorId: { $in: doctorIds },
    }).populate("doctorId", "_id doctorName specialization");


    if (!meetups.length) {
      return res
        .status(404)
        .json({ message: "No sessions found for selected doctors." });
    }

    // Collect sessions in consistent structure
    const allSessions = [];

    meetups.forEach((meetup) => {
      const sessionsByDay = meetup.sessions || {};
      Object.keys(sessionsByDay).forEach((day) => {
        sessionsByDay[day].forEach((session) => {
          allSessions.push({
            doctorName: meetup.doctorId.doctorName,
            specialization: meetup.doctorId.specialization,
            doctorId: meetup.doctorId?._id || meetup.doctorId,
            day,
            date: session.date,
            startTime: session.startTime,
            endTime: session.endTime,
            maxPatients: session.maxPatients,
            availableSlots: session.availableSlots || 0, // optional safety
          });
        });
      });
    });

    res.status(200).json(allSessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ error: "Server error while fetching sessions." });
  }
};
