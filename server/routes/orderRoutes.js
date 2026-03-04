const express = require('express');
const router = express.Router();
const { create, getMyOrders, getById, updateStatus, cancelOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, create);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getById);
router.put('/:id/status', protect, updateStatus);
router.put('/:id/cancel', protect, cancelOrder);

module.exports = router;
