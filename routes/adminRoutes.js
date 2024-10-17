const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

router.post('/login', adminController.login);
router.post('/logout', authMiddleware.requireAuth, adminController.logout);
router.post('/doctors', authMiddleware.requireAuth, adminController.addDoctor);
router.put('/doctors/:id', authMiddleware.requireAuth, adminController.updateDoctor);
router.delete('/doctors/:id', authMiddleware.requireAuth, adminController.deleteDoctor);
router.get('/appointments', authMiddleware.requireAuth, adminController.getAllAppointments);

module.exports = router;