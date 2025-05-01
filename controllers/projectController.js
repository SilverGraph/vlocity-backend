// controllers/projectController.js
const Project = require('../models/Project');

// Admin creates a project
exports.createProject = async (req, res) => {
    try {
        const { name, description, members } = req.body;
        const project = new Project({
            name,
            description,
            members,
            createdBy: req.user.id, // assuming JWT middleware adds req.user
        });
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: 'Project creation failed' });
    }
};

// Get projects where the user is a member
exports.getUserProjects = async (req, res) => {
    try {
        const projects = await Project.find({ members: req.user.id });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch user projects' });
    }
};
