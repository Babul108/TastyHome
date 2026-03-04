const express = require('express');
const router = express.Router();
const {
  register, login, getProfile, updateProfile, toggleAvailability,
  getAssignedOrders, updateOrderStatus, getEarnings, updateLocation,
} = require('../controllers/deliveryController');
const { protect } = require('../middleware/auth');
const delivery = require('../middleware/delivery');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, delivery, getProfile);
router.put('/profile', protect, delivery, upload.single('avatar'), updateProfile);
router.put('/availability', protect, delivery, toggleAvailability);
router.get('/orders', protect, delivery, getAssignedOrders);
router.get('/earnings', protect, delivery, getEarnings);
router.put('/location', protect, delivery, updateLocation);
router.put('/order/:id/status', protect, delivery, updateOrderStatus);

module.exports = router;
