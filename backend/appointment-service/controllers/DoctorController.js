const Doctor = require('../models/Doctor');

exports.addDoctor = async(req , res)=>{

    try{

    const{doctorName, specialization,licenseNumber,doctorFee,email,phone} = req.body;
    const newDoctor = new Doctor({

        doctorName : doctorName,
        specialization : specialization,
        licenseNumber : licenseNumber,
        doctorFee : doctorFee,
        email :email,
        phone : phone


    })

    const response = await newDoctor.save();
    if(!response) res.status(400).json('Error Occured in saving doctors');
    res.status(201).json(`Doctor ${doctorName} added successfuly`)

    }catch(err){

        res.status(500).json(err);

    }


};

exports.getAllDoctors = async(req ,res) =>{

    try{

        const doctors = await Doctor.find();
        if(doctors.length === 0) res.status(404).json({message: "No Any Available Doctors"});
        res.status(201).json(doctors);

    }catch(err){

        res.status(500).json(err);
    }
};

exports.getDoctorByName = async(req,res) => {

    
    try{

    const {doctorName }= req.params;

    const doctor = await Doctor.findOne({doctorName: { $regex: doctorName, $options: "i" },});

    if(!doctor) res.status(404).json({message : `Doctor ${doctorName} Not Found`});
    res.status(201).json(doctor);

    }catch(err){

        res.status(500).json({message : "Internal Server Error"});

    }

    
};

exports.getDoctorBySpecialization = async(req,res)=>{

    try{

        const {specialization} = req.params;
        const doctor = await Doctor.find({specialization});
        if(doctor.length === 0) res.status(404).json({message : `No ${specialization} Doctors Available`});
        res.status(201).json(doctor);

    }catch(err){

        res.status(500).json({message : "Internal Server Error"});

    }
};

exports.getDoctorByNameAndSpecialization = async (req, res) => {
  try {
    const { name, specialization } = req.query;

    const query = {};

    if (name) query.doctorName = { $regex: name, $options: "i" };
    if (specialization) query.specialization = { $regex: specialization, $options: "i" };

    const doctors = await Doctor.find(query, 'doctorName specialization -_id');

    if (doctors.length === 0) {
      return res.status(404).json({ message: "No matching doctors found" });
    }

    res.status(200).json({
      message: "Matching doctors",
      doctors,
    });

  } catch (err) {
    console.error(err); 
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};
