const Review = require('../models/Review');
const Order = require('../models/Order');
const Restaurant = require('../models/Restaurant');

const create = async (req, res) => {
  try {
    const { restaurantId, orderId, rating, comment, images } = req.body;

    const order = await Order.findOne({ _id: orderId, user: req.user._id, status: 'delivered' });
    if (!order) {
      return res.status(400).json({ success: false, message: 'Order not found or not yet delivered' });
    }

    const existing = await Review.findOne({ order: orderId, user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Review already submitted for this order' });
    }

    const review = await Review.create({
      user: req.user._id,
      restaurant: restaurantId,
      order: orderId,
      rating,
      comment,
      images: images || [],
    });

    const reviews = await Review.find({ restaurant: restaurantId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avgRating * 10) / 10,
      totalReviews: reviews.length,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByRestaurant = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const review = await Review.findOne({ _id: req.params.id, user: req.user._id });
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    const { rating, comment } = req.body;
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const query = { _id: req.params.id };
    if (req.user.role !== 'admin') query.user = req.user._id;
    const review = await Review.findOneAndDelete(query);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { create, getByRestaurant, update, deleteReview };
