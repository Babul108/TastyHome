const delivery = (req, res, next) => {
  if (req.user && req.user.role === 'delivery') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied: Delivery personnel only' });
};

module.exports = delivery;
