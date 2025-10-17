const mongoose = require('mongoose');


const DoctorMeetups = new mongoose.Schema({

    doctorId : {  type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    sessions: {
    Monday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true }, 
        endTime: { type: String, required: true },   
        maxPatients: { type: Number, required: true, min: 1 },
        availableSlots : {type : Number, default: function () { return this.maxPatients; }}
      }
    ],
    Tuesday: [
      {
        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 },
        availableSlots : {type : Number, default: function () { return this.maxPatients; }
      }
      }
    ],
    Wednesday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 },
        availableSlots : {type : Number, default: function () { return this.maxPatients; }}
      }
    ],
    Thursday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 },
        availableSlots : {type : Number, default: function () { return this.maxPatients; }}
      }
    ],
    Friday: [
      {

         date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 },
        availableSlots : {type : Number, default: function () { return this.maxPatients; }}
      }
    ],
    Saturday: [
      {

        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 },
        availableSlots : {type : Number, default: function () { return this.maxPatients; }}
      }
    ],
    Sunday: [
      {
        date : {type : Date, required : true},
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        maxPatients: { type: Number, required: true, min: 1 },
        availableSlots : {type : Number, default: function () { return this.maxPatients; }}
      }
    ]
  }
})

module.exports = mongoose.model("DoctorMeetUps", DoctorMeetups);