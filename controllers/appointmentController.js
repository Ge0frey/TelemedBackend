const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

exports.bookAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    const patient_id = req.session.patientId;

    // Check if the doctor exists
    const doctor = await Doctor.findById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check doctor availability
    const isAvailable = await Appointment.checkAvailability(doctor_id, appointment_date, appointment_time);
    if (!isAvailable) {
      return res.status(400).json({ message: 'The selected time slot is not available' });
    }

    const appointmentId = await Appointment.create({ patient_id, doctor_id, appointment_date, appointment_time });
    res.status(201).json({ message: 'Appointment booked successfully', appointmentId });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment', error: error.message });
  }
};

exports.getPatientAppointments = async (req, res) => {
  try {
    const patientId = req.session.patientId;
    const appointments = await Appointment.findByPatient(patientId);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

exports.getDoctorAppointments = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    const appointments = await Appointment.findByDoctor(doctorId);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { appointment_date, appointment_time, status } = req.body;
    
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient_id !== req.session.patientId) {
      return res.status(403).json({ message: 'Unauthorized to update this appointment' });
    }

    if (appointment_date && appointment_time) {
      const isAvailable = await Appointment.checkAvailability(appointment.doctor_id, appointment_date, appointment_time);
      if (!isAvailable) {
        return res.status(400).json({ message: 'The selected time slot is not available' });
      }
    }

    await Appointment.update(appointmentId, { appointment_date, appointment_time, status });
    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating appointment', error: error.message });
  }
};

exports.cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (appointment.patient_id !== req.session.patientId) {
      return res.status(403).json({ message: 'Unauthorized to cancel this appointment' });
    }

    await Appointment.update(appointmentId, { status: 'canceled' });
    res.json({ message: 'Appointment canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error canceling appointment', error: error.message });
  }
};