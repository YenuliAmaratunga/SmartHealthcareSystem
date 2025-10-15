const mongoose = require('mongoose');


const DoctorMeetups = new mongoose.Schema({

    doctorId : {  type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    sessions: {
    Monday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true }, 
        endTime: { type: String, required: true },   
        maxPatients: { type: Number, required: true, min: 1 }
      }
    ],
    Tuesday: [
      {
        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 }
      }
    ],
    Wednesday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 }
      }
    ],
    Thursday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 }
      }
    ],
    Friday: [
      {

         date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 }
      }
    ],
    Saturday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 }
      }
    ],
    Sunday: [
      {
        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 }
      }
    ]
  }
})

module.exports = mongoose.model("DoctorMeetUps", DoctorMeetups);