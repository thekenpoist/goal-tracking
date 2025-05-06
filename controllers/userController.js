const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const argon2 = require('argon2');

exports.getSettingsPage = async (req, res, next) => {
    const uuid = req.session.userUuid;

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.getUserByUUID(uuid);
        if (!user) {
            return res.status(404).render('404', {
                pageTitle: 'User Not Found',
                currentPage: 'dashboard',
                layout: 'layouts/main-layout'
            });
        }
        res.render('profiles/settings', {
            pageTitle: 'Settings',
            currentPage: 'dashboard',
            layout: 'layouts/dashboard-layout',
            formData: {
                email: user.email,
                confirmEmail: ''
            },
            errorMessage: null,
            successMessage: null
        });
    } catch (err) {
        console.error('Error fetching user', err);
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            currentPage: 'dashboard'
        });
    }
};

exports.postUpdateEmailOrPassword = async (req, res, next) => {
    const uuid = req.session.userUuid;
    const errors = validationResult(req);

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('profiles/settings', {
            pageTitle: 'Settings',
            currentPage: 'settings',
            errorMessage: errors.array().map(e => e.msg).join(', '),
            successMessage: null,
            formData: req.body
        });
    }

    try {
        const currentUser = await User.getUserByUUID(uuid);

        if (!currentUser) {
            return res.status(404).render('404', {
                pageTitle: 'User Not Found',
                currentPage: 'dashboard'
            });
        }

        const { username, email, password, realName, avatar, currentPassword } = req.body;
        const passwordChanged = password?.trim().length > 0;
        const passwordIsValid = await argon2.verify(currentUser.password, currentPassword);

        if (!passwordIsValid) {
            return res.status(401).render('profiles/settings', {
                pageTitle: 'Settings',
                currentPage: 'settings',
                errorMessage: 'Current password is incorrect.',
                successMessage: null,
                formData: req.body
            });
        }

        const updatedFields = {};

        if (username) updatedFields.username = username;
        if (email) updatedFields.email = email;
        if (passwordChanged) updatedFields.password = password;
        if (realName) updatedFields.realName = realName;
        if (avatar) updatedFields.avatar = avatar;

        const updatedUser = await User.updateUser(uuid, updatedFields);

        return res.render('profiles/settings', {
            pageTitle: 'Settings',
            currentPage: 'settings',
            layout: 'layouts/dashboard-layout',
            errorMessage: null,
            successMessage: 'Settings updated successfully!',
            formData: {}
        });
    } catch (err) {
        console.error('Error updating user settings:', err.message);
        res.status(500).render('profiles/settings', {
            pageTitle: 'Settings',
            currentPage: 'settings',
            errorMessage: 'Something went wrong. Please try again',
            successMessage: null,
            formData: req.body
        });
        
    }
};

exports.getShowProfile = async (req, res, next) => {
    const uuid = req.session.userUuid;

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.getUserByUUID(uuid);
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

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.getUserByUUID(uuid);

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
        const originalUser = await User.getUserByUUID(uuid);

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
            password: password,
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
        const user = await User.getUserByUUID(uuid);

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
    const uuid = req.session.userUuid;

    try {
        const deleted = await User.deleteUser(uuid);

        if (!deleted) {
            return res.status(404).render('404', {
                pageTitle: 'User Not Found',
                currentPage: 'profile'
            });
        }

        req.session.destroy(err => {
            if (err) {
                console.error('Session destroy error:', err);
                return res.redirect('/');
            }
            res.redirect('/');
        });
    } catch (err) {
        console.error('Error deleting user', err);
        res.status(500).render('500', {
            pageTitle: "Server error",
            currentPage: '/'
        });
    }
};