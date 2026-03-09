const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/../.env' });
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

const fixCounts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find({});
        for (let user of users) {
            const resolvedCount = await Issue.countDocuments({ reporter: user._id, status: 'Resolved' });
            await User.findByIdAndUpdate(user._id, { resolvedCount });
        }
        console.log("Counts fixed successfully!");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fixCounts();
