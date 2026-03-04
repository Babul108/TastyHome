const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
  name: String,
  price: Number,
  quantity: Number,
  image: String,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },
    deliveryFee: { type: Number, default: 40 },
    discount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      default: 'pending',
    },
    deliveryAddress: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    paymentMethod: { type: String, enum: ['upi', 'cod', 'card'], default: 'cod' },
    paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
    deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryStatus: { type: String },
    deliveryTimestamps: {
      confirmed: Date,
      preparing: Date,
      outForDelivery: Date,
      delivered: Date,
    },
    couponCode: { type: String },
    couponDiscount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
