const { validationResult } = require("express-validator");
const User = require("../models/userModel");

/*
exports.getCreateProfile = (req, res, next) => {
    res.render('profiles/new-profile', {
        pageTitle: "Create Profile",
        currentPage: 'profile',
        errorMessage: null,
        formData: {}
    });
};

exports.postCreateProfile = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('profiles/new-profile', {
            pageTitle: 'Create Profile',
            currentPage: 'profiles',
            errorMessage: errors.array().map(e => e.msg).join(','),
            formData: req.body
        });
    }

    try {
        const { username, email, password, realName, avatar } = req.body;

        const newUser = await User.addUser({
            username,
            email,
            passwordHash: password,
            realName,
            avatar
        });

        res.redirect(`/profiles/${newUser.uuid}`);
    } catch (err) {
        console.error('Error Creating Profile:', err.message);
        res.status(400).render('profiles/new-profile', {
            pageTitle: 'Create Profile',
            currentPage: 'profiles',
            errorMessage: 'Something went wrong. Please try again',
            formData: req.body
        });
    }

}; */

exports.getEditUser = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const user = await User.getUserById(userId);

        if (!user) {
            return res.status(404).render('404', {
                pageTitle: "User Not Found",
                currentPage: 'profile',
                layout: 'layouts/main-layout'
            });
        }

    res.render('profiles/edit-profile', {
        pageTitle: "Edit Profile",
        currentPage: 'profile',
        layout: 'layouts/dashboard-layout',
        errorMessage: null,
        formData: user
        });
    } catch (err) {
        console.error('Error fetching user:', err);
        res.status(500).render('500', {
            pageTitle: "Server error",
            currentPage: 'profile'
        });
    }
};

exports.postEditUser = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const originalUser = await User.getUserById(req.params.userId);

        return res.status(422).render('profiles/edit-profile', {
            pageTitle: 'Edit Profile',
            currentPage: 'profiles',
            errorMessage: errors.array().map(e => e.msg).join(','),
            formData: {
                ...originalUser,
                ...req.body
            }
        });
    }

    try {
        const userId = req.params.userId;
        const { username, email, password, realName, avatar } = req.body;

        const editUser = await User.updateUser(userId, {
            username,
            email,
            passwordHash: password,
            realName,
            avatar
        });

        res.redirect(`/profiles/${editUser.uuid}`);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).render('profiles/edit-profile', {
            pageTitle: 'Edit Profile',
            currentPage: 'profiles',
            errorMessage: 'Something went wrong. Please try again',
            formData: req.body
        });
    }
};

exports.getUserById = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const user = await User.getUserById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.locals.currentUser = user;

        res.render('profiles/show-profile', {
            pageTitle: 'User Profile',
            user,
            currentPage: 'profile',
            layout: 'layouts/dashboard-layout'
        });
    } catch (err) {
        console.error('Error fetching user by ID:', err);
        res.status(500).render('500', {
            pageTitle: "Server error",
            currentPage: 'profile'
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    const userId = req.params.userId;

    try {
        const deleted = await User.deleteUser(userId);

        if (!deleted) {
            return res.status(404).render('404', {
                pageTitle: 'User Not Found',
                currentPage: 'profile'
            });
        }
        
        res.redirect('/');
    } catch (err) {
        console.error('Error deleting user', err);
        res.status(500).render('500', {
            pageTitle: "Server error",
            currentPage: '/'
        });

    }
};