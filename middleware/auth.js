exports.requireAuth = (req, res, next) => {
  if (req.session && req.session.patientId) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};