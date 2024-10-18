const db = require('../config/database');

exports.searchDoctors = async (searchTerm, specialization) => {
  let query = `
    SELECT id, first_name, last_name, specialization, email, phone 
    FROM doctors 
    WHERE (first_name LIKE ? OR last_name LIKE ? OR specialization LIKE ?)
  `;
  let params = [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`];

  if (specialization) {
    query += ' AND specialization = ?';
    params.push(specialization);
  }

  const [rows] = await db.execute(query, params);
  return rows;
};

exports.filterAppointments = async (status, startDate, endDate) => {
  let query = 'SELECT * FROM appointments WHERE 1=1';
  let params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (startDate) {
    query += ' AND appointment_date >= ?';
    params.push(startDate);
  }

  if (endDate) {
    query += ' AND appointment_date <= ?';
    params.push(endDate);
  }

  const [rows] = await db.execute(query, params);
  return rows;
};