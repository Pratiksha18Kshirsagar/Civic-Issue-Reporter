const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    badge: {
        type: String,
        enum: ['Newbie', 'Active Citizen', 'Civic Hero'],
        default: 'Newbie'
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    resolvedCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
