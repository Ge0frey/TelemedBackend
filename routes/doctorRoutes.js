const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authMiddleware = require('../middleware/auth');

router.post('/register', doctorController.register);
router.post('/login', doctorController.login);
router.post('/logout', authMiddleware.requireAuth, doctorController.logout);
router.put('/profile', authMiddleware.requireAuth, doctorController.updateProfile);
router.post('/schedule', authMiddleware.requireAuth, doctorController.setSchedule);
router.get('/schedule', authMiddleware.requireAuth, doctorController.getSchedule);
router.get('/', doctorController.getAllDoctors);

module.exports = router;