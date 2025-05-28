const { validationResult } = require("express-validator");
const { User } = require('../models');
const { Goal } = require('../models');
const argon2 = require('argon2');
const { Op } = require('sequelize');
const { renderServerError } = require('../utils/errorHelpers');

exports.getSettingsPage = async (req, res, next) => {
    const uuid = req.session.userUuid;

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({ where: { uuid } });
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
        return renderServerError(res, err, 'dashboard');
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
        const currentUser = await User.findOne({ where: { uuid } });

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

        const duplicate = await User.findOne({
            where: {
                uuid: { [Op.ne]: uuid },
                [Op.or]: [
                    username ? { username: username.trim().toLowerCase() } : null,
                    email ? { email: email.trim().toLowerCase() } : null
                ].filter(Boolean)
            }
        });

        if (duplicate) {
            return res.status(400).render('profiles/settings', {
                pageTitle: 'Settings',
                currentPage: 'settings',
                errorMessage: 'Username or email already in use by another user',
                successMessage: null,
                formData: req.body
            });
        }

        const updatedFields = {
            username: username?.trim().toLowerCase() || currentUser.username,
            email: email?.trim().toLowerCase() || currentUser.email,
            password: passwordChanged
                ? await argon2.hash(password)
                : currentUser.password,
            realName: realName || currentUser.realName,
            avatar: avatar || currentUser.avatar,
            updatedAt: new Date()
        }

        await User.update(updatedFields, { where: { uuid } });

        return res.render('profiles/settings', {
            pageTitle: 'Settings',
            currentPage: 'settings',
            layout: 'layouts/dashboard-layout',
            errorMessage: null,
            successMessage: 'Settings updated successfully!',
            formData: {}
        });
    } catch (err) {
        console.error('Error updating user settings:', err);
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
        const user = await User.findOne({ where: { uuid } });
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
        return renderServerError(res, err, 'profile');
    }
};

exports.getEditUser = async (req, res, next) => {
    const uuid = req.session.userUuid;

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    try {
        const user = await User.findOne({ where: { uuid } });

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
        return renderServerError(res, err, 'profile');
    }
};

exports.postEditUser = async (req, res, next) => {
    const uuid = req.session.userUuid;
    const errors = validationResult(req);

    if (!uuid) {
        return res.redirect('/auth/login');
    }

    if (!errors.isEmpty()) {
        const originalUser = await User.findOne({ where: { uuid } });

        return res.status(422).render('profiles/edit-profile', {
            pageTitle: 'Edit Profile',
            currentPage: 'profile',
            errorMessage: errors.array().map(e => e.msg).join(', '),
            formData: {
                ...originalUser?.dataValues,
                ...req.body
            }
        });
    }

    try {
        const { username, email, password, realName, avatar } = req.body;

        const currentUser = await User.findOne({ where: { uuid } });
        if (!currentUser) {
            return res.status(404).render('404', {
                pageTitle: 'User Not Found',
                currentPage: 'profile'
            });
        }

        const duplicate = await User.findOne({
            where: {
                uuid: { [Op.ne]: uuid },
                [Op.or]: [
                    username ? { username: username.trim().toLowerCase() } : null,
                    email ? { email: email.trim().toLowerCase() } : null
                ].filter(Boolean)
            }
        });

        if (duplicate) {
            return res.status(400).render('profiles/edit-profile', {
                pageTitle: 'Edit Profile',
                currentPage: 'profile',
                errorMessage: 'Username or email already in use.',
                formData: req.body
            });
        }

        const updatedFields = {
            username: username?.trim().toLowerCase() || currentUser.username,
            email: email?.trim().toLowerCase() || currentUser.email,
            password: password
                ? await argon2.hash(password)
                : currentUser.password,
            realName: realName || currentUser.realName,
            avatar: avatar || currentUser.avatar,
            timezone: timezone || currentUser.timezone,
            updatedAt: new Date()
        };

        await User.update(updatedFields, { where: { uuid } });

        res.redirect(`/profiles/${uuid}`);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).render('profiles/edit-profile', {
            pageTitle: 'Edit Profile',
            currentPage: 'profile',
            errorMessage: 'Something went wrong. Please try again.',
            formData: req.body
        });
    }
};

exports.getUserByUUID = async (req, res, next) => {
    const uuid = req.session.userUuid;

    try {
        const user = await User.findOne({ where: { uuid } });

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.locals.currentUser = user;

        res.render('profiles/show-profile', {
            pageTitle: 'User Profile',
            formData: user,
            currentPage: 'profile',
            layout: 'layouts/dashboard-layout'
        });
    } catch (err) {
        console.error('Error fetching user by UUID:', err);
        return renderServerError(res, err, 'profile');
    }
};

exports.deleteUser = async (req, res, next) => {
    const uuid = req.session.userUuid;

    try {
        const deleted = await User.destroy({ where: { uuid } });

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
        return renderServerError(res, err, '/');
    }
};