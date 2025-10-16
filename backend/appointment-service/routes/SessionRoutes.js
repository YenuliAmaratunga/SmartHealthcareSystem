const express = require('express');
const router = express.Router();
const doctorSession = require('../controllers/DoctorSessionController')

router.post('/addSession',doctorSession.addDoctorSession);
router.get('/getSessionsByName/:doctorName',doctorSession.readSessionByDoctorName);
router.get('/getSessionBySpecialization/:specialization',doctorSession.readSessionBySpecialization);
router.get('/filterSession',doctorSession.querySessions);
router.put('/reserveSlot',doctorSession.reserveSlot);



module.exports = router;