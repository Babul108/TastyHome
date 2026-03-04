const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const getAll = async (req, res) => {
  try {
    const { cuisine, rating, priceRange, page = 1, limit = 10 } = req.query;
    const filter = { isActive: true };
    if (cuisine) filter.cuisine = { $in: [cuisine] };
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (priceRange) filter.priceRange = priceRange;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).skip(skip).limit(parseInt(limit)).populate('owner', 'name email'),
      Restaurant.countDocuments(filter),
    ]);

    res.json({ success: true, restaurants, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant || !restaurant.isActive) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    const menuItems = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true });
    res.json({ success: true, restaurant, menuItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f) => `/uploads/${f.filename}`);
    }
    const restaurant = await Restaurant.create(data);
    res.status(201).json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
    res.json({ success: true, restaurant });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found' });
    res.json({ success: true, message: 'Restaurant deactivated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getNearby = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 10000 } = req.query;
    if (!lng || !lat) {
      return res.status(400).json({ success: false, message: 'Coordinates required' });
    }
    const restaurants = await Restaurant.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });
    res.json({ success: true, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const search = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ success: false, message: 'Search query required' });
    const regex = new RegExp(q, 'i');
    const restaurants = await Restaurant.find({
      isActive: true,
      $or: [{ name: regex }, { cuisine: regex }, { description: regex }],
    });
    res.json({ success: true, restaurants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAll, getById, create, update, deleteRestaurant, getNearby, search };
