const db = require('../config/database');
const bcrypt = require('bcrypt');

class Admin {
  static async create(adminData) {
    const { username, password, role } = adminData;
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      'INSERT INTO admin (username, password_hash, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM admin WHERE username = ?', [username]);
    return rows[0];
  }

  static async update(id, updateData) {
    const { username, role } = updateData;
    await db.execute(
      'UPDATE admin SET username = ?, role = ? WHERE id = ?',
      [username, role, id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM admin WHERE id = ?', [id]);
  }
}

module.exports = Admin;