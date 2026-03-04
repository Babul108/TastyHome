const express = require('express');
const router = express.Router();
const { getByRestaurant, getByCategory, create, update, deleteItem } = require('../controllers/menuController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');
const upload = require('../middleware/upload');

router.get('/restaurant/:id', getByRestaurant);
router.get('/category/:category', getByCategory);
router.post('/', protect, admin, upload.single('image'), create);
router.put('/:id', protect, admin, upload.single('image'), update);
router.delete('/:id', protect, admin, deleteItem);

module.exports = router;
