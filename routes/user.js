const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

// Only admin can fetch all users
router.get('/', authenticate, getAllUsers);

module.exports = router;
