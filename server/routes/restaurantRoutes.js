const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, deleteRestaurant, getNearby, search } = require('../controllers/restaurantController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/', getAll);
router.get('/search', search);
router.get('/nearby', getNearby);
router.get('/:id', getById);
router.post('/', protect, admin, upload.array('images', 5), create);
router.put('/:id', protect, admin, update);
router.delete('/:id', protect, admin, deleteRestaurant);

module.exports = router;
