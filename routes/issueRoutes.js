// routes/issueRoutes.js
const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const { authenticate, authorize } = require('../middleware/auth');

// Create a new issue (authenticated users)
router.post('/', authenticate, issueController.createIssue);

// Get all issues for a specific project
router.get('/project/:projectId', authenticate, issueController.getProjectIssues);

// Update issue status or assignee (Admin only)
router.patch('/:issueId', authenticate, authorize(['admin']), issueController.updateIssue);


module.exports = router;
