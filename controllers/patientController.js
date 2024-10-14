const Patient = require('../models/Patient');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
  try {
    const { email } = req.body;
    const existingPatient = await Patient.findByEmail(email);
    if (existingPatient) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const patientId = await Patient.create(req.body);
    res.status(201).json({ message: 'Patient registered successfully', patientId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering patient', error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findByEmail(email);
    if (!patient) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, patient.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    req.session.patientId = patient.id;
    res.json({ message: 'Logged in successfully', patientId: patient.id });
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
    const patientId = req.session.patientId;
    await Patient.updateProfile(patientId, req.body);
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const patientId = req.session.patientId;
    await Patient.delete(patientId);
    req.session.destroy();
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account', error: error.message });
  }
};