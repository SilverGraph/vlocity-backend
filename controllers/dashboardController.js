// controllers/dashboardController.js
const Project = require('../models/Project');
const Issue = require('../models/Issue');

exports.adminDashboard = async (req, res, next) => {
    try {
        const projects = await Project.find({ createdBy: req.user.id })
            .populate('members', 'username')
            .lean();

        const projectIds = projects.map(p => p._id);

        const issues = await Issue.find({ project: { $in: projectIds } })
            .populate('assignee', 'username')
            .populate('project', 'name')
            .lean();

        res.json({ projects, issues });
    } catch (err) {
        next(err);
    }
};

// controllers/dashboardController.js
exports.userDashboard = async (req, res, next) => {
    try {
        // Find projects where the user is a member
        const projects = await Project.find({ members: req.user.id })
            .populate('members', 'username')
            .lean();

        const projectIds = projects.map(p => p._id);

        // Only fetch issues assigned to the logged-in user within their projects
        const issues = await Issue.find({
            project: { $in: projectIds },
            assignee: req.user.id
        })
            .populate('assignee', 'username')
            .populate('project', 'name')
            .lean();

        res.json({ projects, issues });
    } catch (err) {
        next(err);
    }
};
