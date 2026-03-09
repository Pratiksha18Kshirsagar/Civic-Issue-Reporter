require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;
const connectDB = require('./utils/db');
const seedAdmin = require('./utils/seedAdmin');
const issueRoutes = require('./routes/issueRoutes');
const userRoutes = require('./routes/userRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const path = require('path');

app.use('/frontend', express.static(path.join(__dirname, '../frontend')));
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Sample route
app.get('/', (req, res) => {
    res.send('Welcome to the Civic Issue Reporter API');
});

app.use('/users', userRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/payment', paymentRoutes);

connectDB().then(async () => {
    await seedAdmin();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
