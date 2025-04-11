const User = require("../models/userModel");

exports.getUserById = (req, res, next) => {
    const userId = req.params.id;
    User.getUserByID(userId, user => {
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.render('users/profile', { user });
    });
};

exports.getAddUser = (req, res, next) => {
    res.render('profiles/new-profile', {
        pageTitle: "Create Profile",
        currentPage: 'profile'
    });
};

exports.postAddUser = (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
};