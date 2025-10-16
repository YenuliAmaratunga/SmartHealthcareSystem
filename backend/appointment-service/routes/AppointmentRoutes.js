const Appointments = require('../controllers/AppointmentController');
const express = require('express');
const router = express.Router();

router.get('/viewAppointments/:patientId',Appointments.fetchAppointments);
router.delete('/deleteAppointments/:appointmentId', Appointments.deleteAppointment);
router.put('/updateAppointment/:appointmentId',Appointments.updateAppointment);



module.exports = router;