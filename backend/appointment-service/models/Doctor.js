const mongoose = require('mongoose');

const Doctor = new mongoose.Schema({
  doctorName: { 
    type: String, 
    required: [true, "Doctor Name is required"] 
  },

  specialization: { 
  type: String, 
  required: [true, "Specialization is required"], 
  enum: [
  
    "General Physician",
    "Family Medicine",
    "Internal Medicine",
    "Emergency Medicine",
    "Preventive Medicine",
    "General Surgeon",
    "Cardiothoracic Surgeon",
    "Orthopedic Surgeon",
    "Neurosurgeon",
    "Plastic Surgeon",
    "Vascular Surgeon",
    "Urologist",
    "ENT (Otolaryngologist)",
    "Ophthalmologist",
    "Cardiologist",
    "Endocrinologist",
    "Gastroenterologist",
    "Hematologist",
    "Infectious Disease Specialist",
    "Nephrologist",
    "Oncologist",
    "Pulmonologist",
    "Rheumatologist",
    "Neurologist",
    "Psychiatrist",
    "Psychologist",
    "Gynecologist",
    "Obstetrician",
    "Pediatrician",
    "Neonatologist",
    "Dermatologist",
    "Allergist / Immunologist",
    "Anesthesiologist",
    "Pathologist",
    "Radiologist",
    "Sports Medicine",
    "Dentist",
    "Other"
  ] 
},

  licenseNumber: { 
    type: String, 
    required: [true, "License Number is required"], 
    unique: true,
    match: [/^[A-Z]{2,5}-\d{4,10}$/, "License number must be in the format ABCD-12345"]
  },


  image: { 
    type: String, 
    default: null 
  },

  doctorFee: { 
    type: Number, 
    required: [true, "Doctor Fee per session is required"], 
    min: [0, "Doctor fee must be a positive number"]
  },

  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
  },

  phone: { 
    type: String, 
    required: [true, "Phone number is required"], 
    unique: true,
    match: [/^\+?[0-9]{9,15}$/, "Please enter a valid phone number"]
  }

}, { timestamps: true });

module.exports = mongoose.model("Doctor", Doctor);
