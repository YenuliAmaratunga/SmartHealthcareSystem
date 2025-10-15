const mongoose = require('mongoose');

const Patient = new mongoose.Schema({

    patientName : {type : String, required : [true, "Patient Name Is Required"]},
    nationalId : {type : String, required : [true, "National Id Is Required"], unique : true},
    dob : {type : Date, required : [true, "Date Of Birthday Is Required"]},
    age : {type : Number, required : [true, "Age Is Required"]},
    gender :{type : String, required : [true, "Gender Is Required"], enum : ["Male", "Female","Other"]},
    email : {type : String, required : [true, "Email Is Required"], unique : true, lowercase : true , match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]},
    phone : {type : String, required : [true, "Phone Is Required"],match: [/^\+?[0-9]{9,15}$/, "Please enter a valid phone number"]},
    password : {type : String, required : true,  minlength: [6, "Password must be at least 6 characters long"] }

})


module.exports = mongoose.model("Patient",Patient);
