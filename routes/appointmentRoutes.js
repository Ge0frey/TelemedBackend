const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/auth');

router.post('/book', authMiddleware.requireAuth, appointmentController.bookAppointment);
router.get('/patient', authMiddleware.requireAuth, appointmentController.getPatientAppointments);
router.get('/doctor/:doctorId', authMiddleware.requireAuth, appointmentController.getDoctorAppointments);
router.put('/:id', authMiddleware.requireAuth, appointmentController.updateAppointment);
router.post('/:id/cancel', authMiddleware.requireAuth, appointmentController.cancelAppointment);

module.exports = router;