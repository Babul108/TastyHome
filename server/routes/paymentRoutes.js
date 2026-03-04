const express = require('express');
const router = express.Router();
const { generateUPIPayment, verifyPayment, getPaymentHistory } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/generate-upi', protect, generateUPIPayment);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

module.exports = router;
