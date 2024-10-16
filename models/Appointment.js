const db = require('../config/database');

class Appointment {
  static async create(appointmentData) {
    const { patient_id, doctor_id, appointment_date, appointment_time } = appointmentData;
    const [result] = await db.execute(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?)',
      [patient_id, doctor_id, appointment_date, appointment_time, 'scheduled']
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM appointments WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByPatient(patientId) {
    const [rows] = await db.execute('SELECT * FROM appointments WHERE patient_id = ?', [patientId]);
    return rows;
  }

  static async findByDoctor(doctorId) {
    const [rows] = await db.execute('SELECT * FROM appointments WHERE doctor_id = ?', [doctorId]);
    return rows;
  }

  static async update(id, updateData) {
    const { appointment_date, appointment_time, status } = updateData;
    await db.execute(
      'UPDATE appointments SET appointment_date = ?, appointment_time = ?, status = ? WHERE id = ?',
      [appointment_date, appointment_time, status, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM appointments WHERE id = ?', [id]);
  }

  static async checkAvailability(doctorId, date, time) {
    const [rows] = await db.execute(
      'SELECT * FROM appointments WHERE doctor_id = ? AND appointment_date = ? AND appointment_time = ?',
      [doctorId, date, time]
    );
    return rows.length === 0;
  }
}

module.exports = Appointment;