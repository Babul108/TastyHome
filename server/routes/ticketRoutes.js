const express = require('express');
const router = express.Router();
const { create, getMyTickets, getById, addMessage, updateStatus } = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', protect, create);
router.get('/my', protect, getMyTickets);
router.get('/:id', protect, getById);
router.post('/:id/message', protect, addMessage);
router.put('/:id/status', protect, admin, updateStatus);

module.exports = router;
