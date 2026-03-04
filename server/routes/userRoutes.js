const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, addAddress, getAddresses } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('avatar'), updateProfile);
router.post('/address', protect, addAddress);
router.get('/addresses', protect, getAddresses);

module.exports = router;
