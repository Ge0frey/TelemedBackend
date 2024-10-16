const db = require('../config/database');
const bcrypt = require('bcrypt');

class Patient {
  static async create(patientData) {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = patientData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
    );

    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM patients WHERE email = ?', [email]);
    return rows[0];
  }

  static async updateProfile(id, updateData) {
    const { first_name, last_name, phone, address } = updateData;
    await db.execute(
      'UPDATE patients SET first_name = ?, last_name = ?, phone = ?, address = ? WHERE id = ?',
      [first_name, last_name, phone, address, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM patients WHERE id = ?', [id]);
  }
}

module.exports = Patient;