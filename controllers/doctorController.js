const Doctor = require('../models/Doctor');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const existingDoctor = await Doctor.findByEmail(email);
    if (existingDoctor) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const doctorId = await Doctor.create(req.body);
    res.status(201).json({ message: 'Doctor registered successfully', doctorId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering doctor', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findByEmail(email);
    if (!doctor) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, doctor.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.doctorId = doctor.id;
    res.json({ message: 'Logged in successfully', doctorId: doctor.id });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

exports.updateProfile = async (req, res) => {
  try {
    const doctorId = req.session.doctorId;
    await Doctor.update(doctorId, req.body);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

exports.setSchedule = async (req, res) => {
  try {
    const doctorId = req.session.doctorId;
    await Doctor.setSchedule(doctorId, req.body.schedule);
    res.json({ message: 'Schedule updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating schedule', error: error.message });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const doctorId = req.session.doctorId;
    const schedule = await Doctor.getSchedule(doctorId);
    res.json(schedule);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching schedule', error: error.message });
  }
};

exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors', error: error.message });
  }
};