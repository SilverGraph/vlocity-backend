const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'user' }).select('_id username role');
        res.json(users);
    } catch (err) {
        next(err);
    }
};
