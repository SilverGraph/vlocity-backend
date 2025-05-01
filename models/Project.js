// models/Project.js
const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Admin
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // User IDs
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', projectSchema);
