const Order = require('../models/Order');
const User = require('../models/User');

const getOrdersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const [total, byStatus] = await Promise.all([
      Order.countDocuments(match),
      Order.aggregate([
        { $match: match },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    res.json({ success: true, total, byStatus });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { paymentStatus: 'paid' };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const result = await Order.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalRevenue = result.reduce((acc, r) => acc + r.revenue, 0);
    res.json({ success: true, totalRevenue, dailyRevenue: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsersReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = { role: 'user' };
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const result = await User.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const totalUsers = result.reduce((acc, r) => acc + r.count, 0);
    res.json({ success: true, totalUsers, dailyRegistrations: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const exportCSV = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const match = {};
    if (startDate || endDate) {
      match.createdAt = {};
      if (startDate) match.createdAt.$gte = new Date(startDate);
      if (endDate) match.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(match)
      .populate('user', 'name email')
      .populate('restaurant', 'name')
      .sort({ createdAt: -1 });

    const header = 'OrderID,Customer,Email,Restaurant,Amount,Status,Payment,Date\n';
    const rows = orders.map((o) =>
      [
        o._id,
        o.user?.name || '',
        o.user?.email || '',
        o.restaurant?.name || '',
        o.totalAmount,
        o.status,
        o.paymentStatus,
        o.createdAt.toISOString().split('T')[0],
      ].join(',')
    );

    const csv = header + rows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=orders-report.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getOrdersReport, getRevenueReport, getUsersReport, exportCSV };
