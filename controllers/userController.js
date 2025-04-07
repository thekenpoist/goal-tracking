const User = require("../models/userModel");

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;
    User.getUserByID(userId, user => {
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.render('users/profile', { user });
    });
};