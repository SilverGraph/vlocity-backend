// controllers/issueController.js
const Issue = require('../models/Issue');
const Project = require('../models/Project');

// Create an issue
exports.createIssue = async (req, res) => {
    try {
        const { title, description, priority, project, assignee, status } = req.body;
        const projectDoc = await Project.findById(project);
        if (!projectDoc) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (!projectDoc.members.includes(assignee)) {
            projectDoc.members.push(assignee);
            await projectDoc.save();
        }
        const issue = new Issue({
            title,
            description,
            priority,
            project,
            assignee,
            status,
            createdBy: req.user.id,
        });
        await issue.save();
        res.status(201).json(issue);
    } catch (err) {
        res.status(400).json({ error: 'Issue creation failed' });
    }
};

// Get all issues for a specific project
exports.getProjectIssues = async (req, res) => {
    try {
        const { projectId } = req.params;
        const issues = await Issue.find({ project: projectId }).populate('assignee', 'username').populate('createdBy', 'username');
        res.json(issues);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch issues' });
    }
};

// Update issue (Admin only)
exports.updateIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { status, assignee } = req.body;

        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            {
                ...(status && { status }),
                ...(assignee && { assignee }),
                updatedAt: Date.now(),
            },
            { new: true }
        );

        if (!updatedIssue) {
            return res.status(404).json({ error: 'Issue not found' });
        }

        res.json(updatedIssue);
    } catch (err) {
        res.status(400).json({ error: 'Failed to update issue' });
    }
};
