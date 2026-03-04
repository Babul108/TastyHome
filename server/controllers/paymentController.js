const QRCode = require('qrcode');
const Payment = require('../models/Payment');
const Order = require('../models/Order');

const generateUPIPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const merchantUPI = process.env.MERCHANT_UPI_ID || 'tastyhome@upi';
    const upiLink = `upi://pay?pa=${merchantUPI}&pn=TastyHome&am=${order.totalAmount}&cu=INR&tn=${orderId}`;
    const qrCode = await QRCode.toDataURL(upiLink);

    const payment = await Payment.findOneAndUpdate(
      { order: orderId },
      { upiLink, qrCode, method: 'upi' },
      { new: true, upsert: true }
    );

    res.json({ success: true, upiLink, qrCode, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, transactionId } = req.body;
    const payment = await Payment.findOneAndUpdate(
      { order: orderId },
      { status: 'completed', transactionId },
      { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });

    await Order.findByIdAndUpdate(orderId, { paymentStatus: 'paid' });
    res.json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate('order', 'status totalAmount createdAt');
    res.json({ success: true, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { generateUPIPayment, verifyPayment, getPaymentHistory };
