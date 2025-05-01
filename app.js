// app.js
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://your-frontend.netlify.app'
}));


// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);


// Use routes
app.get('/', (req, res) => {
    res.redirect('/api/auth/signin');
});
app.use('/api/auth', authRoutes);
// app.use('/api/admin', adminRoutes);

const projectRoutes = require('./routes/projectRoutes');
app.use('/api/projects', projectRoutes);

const issueRoutes = require('./routes/issueRoutes');
app.use('/api/issues', issueRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

const userRoutes = require('./routes/user');
app.use('/api/users', userRoutes);

module.exports = app;
