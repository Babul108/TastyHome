const express = require('express');
const router = express.Router();
const { create, getAll, validate, apply, deleteCoupon } = require('../controllers/couponController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', protect, admin, create);
router.get('/', getAll);
router.post('/validate', validate);
router.post('/apply', protect, apply);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
