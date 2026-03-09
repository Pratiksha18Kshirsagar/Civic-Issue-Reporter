const express = require('express');
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

router.post('/order', authenticate, createOrder);
router.post('/verify', authenticate, verifyPayment);

module.exports = router;
