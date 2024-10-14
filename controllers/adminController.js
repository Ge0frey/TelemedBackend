const Admin = require('../models/Admin');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findByUsername(username);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    req.session.adminId = admin.id;
    res.json({ message: 'Logged in successfully', adminId: admin.id });
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

exports.addDoctor = async (req, res) => {
  try {
    const doctorId = await Doctor.create(req.body);
    res.status(201).json({ message: 'Doctor added successfully', doctorId });
  } catch (error) {
    res.status(500).json({ message: 'Error adding doctor', error: error.message });
  }
};

exports.updateDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    await Doctor.update(doctorId, req.body);
    res.json({ message: 'Doctor updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating doctor', error: error.message });
  }
};

exports.deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;
    await Doctor.delete(doctorId);
    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting doctor', error: error.message });
  }
};

exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appointments', error: error.message });
  }
};