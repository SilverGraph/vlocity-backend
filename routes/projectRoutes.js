// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate, authorize } = require('../middleware/auth');

// Admin creates a project
router.post('/', authenticate, authorize(['admin']), projectController.createProject);

// Any authenticated user fetches their projects
router.get('/my-projects', authenticate, projectController.getUserProjects);

module.exports = router;
