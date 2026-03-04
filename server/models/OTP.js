const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    email: { type: String },
    phone: { type: String },
    otp: { type: String, required: true },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 10 * 60 * 1000),
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('OTP', otpSchema);
