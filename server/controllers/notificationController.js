const Notification = require('../models/Notification');
const User = require('../models/User');

const create = async (req, res) => {
  try {
    const { title, message, type, userId } = req.body;
    const notification = await Notification.create({ title, message, type, user: userId });
    res.status(201).json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { isRead: true });
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendToAll = async (req, res) => {
  try {
    const { title, message, type } = req.body;
    const users = await User.find({ role: 'user' }).select('_id');
    const notifications = users.map((u) => ({ title, message, type: type || 'promo', user: u._id }));
    await Notification.insertMany(notifications);
    res.json({ success: true, message: `Notification sent to ${users.length} users` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { create, getMyNotifications, markAsRead, markAllAsRead, sendToAll };
