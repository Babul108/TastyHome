const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    cuisine: [{ type: String }],
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    images: [{ type: String }],
    priceRange: { type: String, enum: ['$', '$$', '$$$'] },
    deliveryTime: { type: String },
    isActive: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

restaurantSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
