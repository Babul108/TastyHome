const User = require('../models/User');
const Order = require('../models/Order');
const generateToken = require('../utils/generateToken');

const sendTokenCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const register = async (req, res) => {
  try {
    const { name, email, phone, password, vehicleType, vehicleNumber } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const user = await User.create({ name, email, phone, password, role: 'delivery', vehicleType, vehicleNumber });
    const token = generateToken(user._id);
    sendTokenCookie(res, token);
    res.status(201).json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'delivery' }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials or not a delivery account' });
    }
    const token = generateToken(user._id);
    sendTokenCookie(res, token);
    res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { vehicleType, vehicleNumber, bankDetails } = req.body;
    const updateData = {};
    if (vehicleType) updateData.vehicleType = vehicleType;
    if (vehicleNumber) updateData.vehicleNumber = vehicleNumber;
    if (bankDetails) updateData.bankDetails = bankDetails;
    if (req.file) updateData.avatar = `/uploads/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const toggleAvailability = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.isAvailable = !user.isAvailable;
    await user.save();
    res.json({ success: true, isAvailable: user.isAvailable });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryBoy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name phone')
      .populate('restaurant', 'name address');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, deliveryBoy: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (!['out_for_delivery', 'delivered'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status for delivery personnel' });
    }

    order.status = status;
    if (status === 'out_for_delivery') order.deliveryTimestamps.outForDelivery = new Date();
    if (status === 'delivered') {
      order.deliveryTimestamps.delivered = new Date();
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { totalDeliveries: 1, totalEarnings: order.deliveryFee },
      });
    }
    await order.save();
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEarnings = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('totalDeliveries totalEarnings');
    const recentOrders = await Order.find({ deliveryBoy: req.user._id, status: 'delivered' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('totalAmount deliveryFee createdAt');
    res.json({ success: true, totalDeliveries: user.totalDeliveries, totalEarnings: user.totalEarnings, recentOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    await User.findByIdAndUpdate(req.user._id, { currentLocation: { lat, lng } });
    res.json({ success: true, message: 'Location updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getProfile, updateProfile, toggleAvailability, getAssignedOrders, updateOrderStatus, getEarnings, updateLocation };
