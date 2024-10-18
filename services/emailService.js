const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendAppointmentConfirmation = async (to, appointmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Appointment Confirmation',
    text: `Your appointment has been confirmed for ${appointmentDetails.date} at ${appointmentDetails.time} with Dr. ${appointmentDetails.doctorName}.`
  };

  await transporter.sendMail(mailOptions);
};

exports.sendAppointmentReminder = async (to, appointmentDetails) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: to,
    subject: 'Appointment Reminder',
    text: `This is a reminder for your appointment on ${appointmentDetails.date} at ${appointmentDetails.time} with Dr. ${appointmentDetails.doctorName}.`
  };

  await transporter.sendMail(mailOptions);
};