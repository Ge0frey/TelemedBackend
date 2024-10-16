const db = require('../config/database');
const bcrypt = require('bcrypt');

class Doctor {
  static async create(doctorData) {
    const { first_name, last_name, specialization, email, phone, password } = doctorData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO doctors (first_name, last_name, specialization, email, phone, password_hash) VALUES (?, ?, ?, ?, ?, ?)',
      [first_name, last_name, specialization, email, phone, hashedPassword]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM doctors WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM doctors WHERE email = ?', [email]);
    return rows[0];
  }

  static async update(id, updateData) {
    const { first_name, last_name, specialization, phone } = updateData;
    await db.execute(
      'UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, phone = ? WHERE id = ?',
      [first_name, last_name, specialization, phone, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM doctors WHERE id = ?', [id]);
  }

  static async setSchedule(doctorId, schedule) {
    await db.execute('UPDATE doctors SET schedule = ? WHERE id = ?', [JSON.stringify(schedule), doctorId]);
  }

  static async getSchedule(doctorId) {
    const [rows] = await db.execute('SELECT schedule FROM doctors WHERE id = ?', [doctorId]);
    return JSON.parse(rows[0].schedule);
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT id, first_name, last_name, specialization, email, phone FROM doctors');
    return rows;
  }
}

module.exports = Doctor;