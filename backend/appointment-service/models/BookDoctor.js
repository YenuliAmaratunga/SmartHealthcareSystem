const mongoose = require('mongoose');


const BookDoctor = new mongoose.Schema({

    patient : {type : mongoose.Schema.Types.ObjectId ,ref : "Patient", required : true},
    doctor  : {type : mongoose.Schema.Types.ObjectId,ref : "Doctor",required : true},
    speacialization : {type : String, required : true},
    doctorFee : {type : String, required : true},
    sessionDate : {type : Date, required : true},
    sessionTime : {type : String,required : true},
    hospitalFee : {type : Number, default : 1500},
    onlineBookingFee : {type : Number , default : 200},
    totalAmount : {type : Number}

},{timestamps : true});

module.exports = mongoose.model("Appointments",BookDoctor);


