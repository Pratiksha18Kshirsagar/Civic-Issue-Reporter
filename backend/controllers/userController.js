const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: 'customer'
        });

        res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        'secretkey',
        { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Login successful', token, role: user.role, name: user.name });
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
        { userId: user._id, email: user.email, role: user.role },
        'secretkey',
        { expiresIn: '24h' }
    );

    res.status(200).json({ message: 'Admin login successful', token, role: user.role, name: user.name });
};

const getUserStats = async (req, res) => {
    try {
        const Issue = require('../models/issueModel');
        const userId = req.user._id;

        const reportedCount = await Issue.countDocuments({ reporter: userId });
        const resolvedCount = await Issue.countDocuments({ reporter: userId, status: 'Resolved' });

        let newBadge = 'Newbie';
        if (reportedCount >= 5 && resolvedCount >= 2) {
            newBadge = 'Civic Hero';
        } else if (reportedCount >= 2) {
            newBadge = 'Active Citizen';
        }

        // Update badge and resolvedCount if changed
        if (req.user.badge !== newBadge || req.user.resolvedCount !== resolvedCount) {
            await User.findByIdAndUpdate(userId, { badge: newBadge, resolvedCount });
            req.user.badge = newBadge;
            req.user.resolvedCount = resolvedCount;
        }

        res.status(200).json({
            name: req.user.name,
            email: req.user.email,
            phone: req.user.phone,
            badge: req.user.badge,
            reportedCount,
            resolvedCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { createUser, loginUser, adminLogin, getUserStats };
