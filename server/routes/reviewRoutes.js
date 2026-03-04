const express = require('express');
const router = express.Router();
const { create, getByRestaurant, update, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.post('/', protect, create);
router.get('/restaurant/:id', getByRestaurant);
router.put('/:id', protect, update);
router.delete('/:id', protect, deleteReview);

module.exports = router;
