const express = require('express');
const router = express.Router();
const { create, getMyNotifications, markAsRead, markAllAsRead, sendToAll } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', protect, admin, create);
router.get('/my', protect, getMyNotifications);
router.put('/read/:id', protect, markAsRead);
router.put('/read-all', protect, markAllAsRead);
router.post('/send-all', protect, admin, sendToAll);

module.exports = router;
