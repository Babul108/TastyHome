const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    category: {
      type: String,
      enum: [
        'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Diet', 'Desserts',
        'Beverages', 'Biryani', 'Pizza', 'Burger', 'Chinese',
        'South Indian', 'North Indian', 'Street Food',
      ],
      required: true,
    },
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    isVeg: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MenuItem', menuItemSchema);
