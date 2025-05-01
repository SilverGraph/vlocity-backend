// routes/dashboard.js
const express = require('express');
const router = express.Router();
const { adminDashboard, userDashboard } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

router.get('/admin', authenticate, authorize('admin'), adminDashboard);
router.get('/user', authenticate, userDashboard);

module.exports = router;
