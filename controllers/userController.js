const { validationResult } = require("express-validator");
const User = require("../models/userModel");

exports.getShowProfile = async (req, res, next) => {
    const uuid = req.session.userUuid;

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.getUserById(uuid);
        if (!user) { 
            return res.status(404).render('404', {
                pageTitle: 'User Not Found',
                currentPage: 'profile',
                layout: 'layouts/main-layout'
            });
        }

        res.render('profiles/show-profile', {
            pageTitle: 'Show Profile',
            currentPage: 'profile',
            layout: 'layouts/dashboard-layout',
            errorMessage: null,
            formData: user
        });
    } catch (err) {
        console.error('Error fetching user', err);
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            currentPage: 'profile'
        });
    }
};

exports.getEditUser = async (req, res, next) => {
    const uuid = req.params.uuid;

    try {
        const user = await User.getUserById(uuid);

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
    const uuid = req.params.uuid;

    if (!errors.isEmpty()) {
        const originalUser = await User.getUserById(uuid);

        return res.status(422).render('profiles/edit-profile', {
            pageTitle: 'Edit Profile',
            currentPage: 'profile',
            errorMessage: errors.array().map(e => e.msg).join(', '),
            formData: {
                ...originalUser,
                ...req.body
            }
        });
    }

    try {
        const { username, email, password, realName, avatar } = req.body;

        const updatedUser = await User.updateUser(uuid, {
            username,
            email,
            passwordHash: password,
            realName,
            avatar
        });

        res.redirect(`/profiles/${updatedUser.uuid}`);
    } catch (err) {
        console.error('Error updating user:', err.message);
        res.status(500).render('profiles/edit-profile', {
            pageTitle: 'Edit Profile',
            currentPage: 'profile',
            errorMessage: 'Something went wrong. Please try again.',
            formData: req.body
        });
    }
};

exports.getUserByUUID = async (req, res, next) => {
    const uuid = req.params.uuid;

    try {
        const user = await User.getUserById(uuid);

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
        console.error('Error fetching user by UUID:', err);
        res.status(500).render('500', {
            pageTitle: "Server error",
            currentPage: 'profile'
        });
    }
};

exports.deleteUser = async (req, res, next) => {
    const uuid = req.params.uuid;

    try {
        const deleted = await User.deleteUser(uuid);

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