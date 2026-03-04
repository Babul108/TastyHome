const Order = require('../models/Order');
const MenuItem = require('../models/MenuItem');
const Payment = require('../models/Payment');
const { getIO } = require('../config/socket');

const create = async (req, res) => {
  try {
    const { restaurantId, items, deliveryAddress, paymentMethod, couponCode, couponDiscount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItemId);
      if (!menuItem) {
        return res.status(404).json({ success: false, message: `Menu item ${item.menuItemId} not found` });
      }
      const subtotal = menuItem.price * item.quantity;
      totalAmount += subtotal;
      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        image: menuItem.image,
      });
    }

    const discount = couponDiscount || 0;
    const deliveryFee = 40;
    const finalAmount = totalAmount - discount + deliveryFee;

    const order = await Order.create({
      user: req.user._id,
      restaurant: restaurantId,
      items: orderItems,
      totalAmount: finalAmount,
      deliveryFee,
      discount,
      deliveryAddress,
      paymentMethod: paymentMethod || 'cod',
      couponCode,
      couponDiscount: discount,
    });

    await Payment.create({
      order: order._id,
      user: req.user._id,
      amount: finalAmount,
      method: paymentMethod || 'cod',
    });

    try {
      const io = getIO();
      io.emit('new-order', { orderId: order._id });
    } catch (_) {}

    const populated = await Order.findById(order._id)
      .populate('restaurant', 'name address')
      .populate('user', 'name email');

    res.status(201).json({ success: true, order: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find({ user: req.user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('restaurant', 'name images'),
      Order.countDocuments({ user: req.user._id }),
    ]);
    res.json({ success: true, orders, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name address images')
      .populate('deliveryBoy', 'name phone currentLocation vehicleType vehicleNumber');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, deliveryBoyId } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    order.status = status;
    if (deliveryBoyId) order.deliveryBoy = deliveryBoyId;

    const now = new Date();
    if (status === 'confirmed') order.deliveryTimestamps.confirmed = now;
    else if (status === 'preparing') order.deliveryTimestamps.preparing = now;
    else if (status === 'out_for_delivery') order.deliveryTimestamps.outForDelivery = now;
    else if (status === 'delivered') {
      order.deliveryTimestamps.delivered = now;
      order.paymentStatus = order.paymentMethod === 'cod' ? 'paid' : order.paymentStatus;
    }

    await order.save();

    try {
      const io = getIO();
      io.to(`order-${order._id}`).emit('order-status-update', { orderId: order._id, status });
    } catch (_) {}

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage' });
    }
    order.status = 'cancelled';
    await order.save();
    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { create, getMyOrders, getById, updateStatus, cancelOrder };
