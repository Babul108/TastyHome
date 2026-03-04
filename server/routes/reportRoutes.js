const express = require('express');
const router = express.Router();
const { getOrdersReport, getRevenueReport, getUsersReport, exportCSV } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/orders', protect, admin, getOrdersReport);
router.get('/revenue', protect, admin, getRevenueReport);
router.get('/users', protect, admin, getUsersReport);
router.get('/export-csv', protect, admin, exportCSV);

module.exports = router;
