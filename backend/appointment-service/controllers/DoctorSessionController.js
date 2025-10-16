
const DocorMeetups = require('../models/DoctorMeetups');
const Doctor = require('../models/Doctor');
const DoctorMeetups = require('../models/DoctorMeetups');


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
        res.status(201).json(session);
       

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

    
    const doctorFilter = {};
    if (name) doctorFilter.doctorName = { $regex: name, $options: "i" };
    if (specialization)
      doctorFilter.specialization = { $regex: specialization, $options: "i" };

   
    const doctors = await Doctor.find(doctorFilter, "_id doctorName specialization");
    if (doctors.length === 0) {
      return res.status(404).json({ message: "No matching doctors found" });
    }

    const doctorIds = doctors.map((doc) => doc._id);


    const sessionQuery = { doctorId: { $in: doctorIds } };

    
    const meetups = await DocorMeetups.find(sessionQuery).populate("doctorId", "doctorName specialization");

    if (!meetups.length) {
      return res.status(404).json({ message: "No sessions found for the selected doctors" });
    }

    
    const filteredResults = [];

    meetups.forEach((meetup) => {
      const sessionsByDay = meetup.sessions;

      Object.keys(sessionsByDay).forEach((day) => {
        sessionsByDay[day].forEach((session) => {
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

          if (isMatch) {
            filteredResults.push({
              doctorName: meetup.doctorId.doctorName,
              specialization: meetup.doctorId.specialization,
              day,
              date: session.date,
              startTime: session.startTime,
              endTime: session.endTime,
              maxPatients: session.maxPatients,
            });
          }
        });
      });
    });

    if (!filteredResults.length) {
      return res
        .status(404)
        .json({ message: "No matching sessions found for the given filters" });
    }

    res.status(200).json({ results: filteredResults });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
};

exports.reserveSlot = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

  
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

  
    const doctorMeetup = await DocorMeetups.findOne({ doctorId });
    if (!doctorMeetup) {
      return res.status(404).json({ message: "No sessions found for this doctor" });
    }

    const dayOfWeek = new Date(date).toLocaleDateString("en-US", { weekday: "long" });

    const sessions = doctorMeetup.sessions[dayOfWeek];
    if (!sessions || sessions.length === 0) {
      return res.status(404).json({ message: `No sessions found for ${dayOfWeek}` });
    }


    const toMinutes = (t) => {
      if (!t) return null;
      const [timePart, modifier] = t.split(' ');
      let [hours, minutes] = timePart.split(':').map(Number);
      if (modifier === 'PM' && hours !== 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };


    const [reqHours, reqMinutes] = time.split(':').map(Number);
    const requestedMinutes = reqHours * 60 + reqMinutes;


    const session = sessions.find(s => {
      const sessionDate = new Date(s.date).toISOString().slice(0, 10);
      const sessionStart = toMinutes(s.startTime);
      const sessionEnd = toMinutes(s.endTime);

      return sessionDate === new Date(date).toISOString().slice(0, 10) &&
             requestedMinutes >= sessionStart &&
             requestedMinutes <= sessionEnd;
    });

    if (!session) {
      return res.status(404).json({ message: "No matching session found for given date/time" });
    }

 
    if (!session.availableSlots || session.availableSlots <= 0) {
      return res.status(400).json({ message: "No available slots left" });
    }


    session.availableSlots -= 1;

    await doctorMeetup.save();

    return res.status(200).json({
      message: "Slot reserved successfully",
      doctor: doctor.doctorName,
      date,
      time,
      remainingSlots: session.availableSlots
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error reserving slot",
      error: err.message
    });
  }
};
