// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signin route
router.get('/signin', (req, res) => {
    res.json({ message: 'Signin route' });
})

// Register route
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const user = new User({ username, password, role });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ error: 'Registration failed' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
                // Add any other user data you want to send
            },
        });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;
