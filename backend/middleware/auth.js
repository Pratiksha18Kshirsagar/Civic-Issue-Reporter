const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const authenticate = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const decoded = jwt.verify(token, 'secretkey');

        User.findById(decoded.userId).then(user => {
            if (!user) {
                throw new Error('User not found');
            }
            req.user = user;
            next();
        }).catch(err => {
            return res.status(401).json({ success: false, message: 'User not found' });
        });

    } catch (err) {
        console.log(err);
        return res.status(401).json({ success: false, message: 'Invalid Token' });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
};

module.exports = { authenticate, isAdmin };
