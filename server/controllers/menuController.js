const MenuItem = require('../models/MenuItem');

const getByRestaurant = async (req, res) => {
  try {
    const items = await MenuItem.find({ restaurant: req.params.id, isAvailable: true });
    res.json({ success: true, menuItems: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getByCategory = async (req, res) => {
  try {
    const items = await MenuItem.find({ category: req.params.category, isAvailable: true }).populate('restaurant', 'name');
    res.json({ success: true, menuItems: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const create = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const item = await MenuItem.create(data);
    res.status(201).json({ success: true, menuItem: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const update = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;
    const item = await MenuItem.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.json({ success: true, menuItem: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Menu item not found' });
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getByRestaurant, getByCategory, create, update, deleteItem };
