const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authMiddleware = require('../middleware/auth');

router.post('/register', patientController.register);
router.post('/login', patientController.login);
router.post('/logout', authMiddleware.requireAuth, patientController.logout);
router.put('/profile', authMiddleware.requireAuth, patientController.updateProfile);
router.delete('/account', authMiddleware.requireAuth, patientController.deleteAccount);

module.exports = router;