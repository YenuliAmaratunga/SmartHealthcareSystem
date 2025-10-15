const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/DoctorController');

router.post('/addDoctor',DoctorController.addDoctor);
router.get('/viewDoctors',DoctorController.getAllDoctors);
router.get('/getDoctorByName/:doctorName',DoctorController.getDoctorByName);
router.get('/getDoctorBySpecialization/:specialization',DoctorController.getDoctorBySpecialization);
router.get('/searchDoctors', DoctorController.getDoctorByNameAndSpecialization);


module.exports = router;

