const express = require('express');
const router = express.Router();
const { getDashboardStats, getAllUsers, getAllOrders, getAllRestaurants, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.get('/orders', protect, admin, getAllOrders);
router.get('/restaurants', protect, admin, getAllRestaurants);
router.put('/user/:id/role', protect, admin, updateUserRole);
router.delete('/user/:id', protect, admin, deleteUser);

module.exports = router;
