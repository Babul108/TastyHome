const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ['upi', 'cod', 'card'], required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    upiLink: { type: String },
    qrCode: { type: String },
    transactionId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
