const Razorpay = require('razorpay');
require('dotenv').config();

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret',
});

const createOrder = async (req, res) => {
    try {
        const options = {
            amount: 100, // Amount in paise (1 INR = 100 paise)
            currency: 'INR',
            receipt: `receipt_order_${Date.now()}`,
        };

        const order = await razorpayInstance.orders.create(options);

        if (!order) return res.status(500).json({ message: 'Error creating order' });

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating order' });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const crypto = require('crypto');
        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }

        res.status(200).json({ success: true, message: 'Payment verified successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while verifying payment' });
    }
};

module.exports = { createOrder, verifyPayment };
