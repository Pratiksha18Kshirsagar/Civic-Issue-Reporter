const bcrypt = require('bcrypt');
const User = require('../models/userModel');

const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            console.log('Admin already exists:', existingAdmin.email);
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        await User.create({
            name: 'Admin',
            email: 'admin@civic.com',
            phone:'1212121212',
            password: hashedPassword,
            role: 'admin'
        });

        console.log('Admin seeded: admin@civic.com / admin123');
    } catch (error) {
        console.error('Admin seed error:', error);
    }
};

module.exports = seedAdmin;
