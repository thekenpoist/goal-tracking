const { validationResult } = require('express-validator');
const User = require('../models/userModel');
const argon2 = require('argon2');
const { Op } = require('sequelize');

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        pageTitle: "Sign Up",
        currentPage: 'signup',
        errorMessage: null,
        formData: {}
    });
};

exports.postSignup = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign Up',
            currentPage: 'signup',
            errorMessage: errors.array().map(e => e.msg).join(', '),
            formData: req.body
        });
    }

    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ where: { email: email.trim().toLowerCase() } });

        if (existingUser) {
            return res.status(400).render('auth/signip', {
                pageTitle: 'Sign Up',
                currentPage: 'signup',
                errorMessage: 'Email is already registered',
                formData: req.body
            });
        }

        const hashedPassword = await argon2.hash(password);

        const newUser = await User.create({
            username: '',
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            realName: '',
            avatar: ''
        });

        req.session.userUuid = newUser.uuid;

        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
            }
            res.redirect('/dashboard');
        });

    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).render('auth/signup', {
            pageTitle: 'Sign Up',
            currentPage: 'signup',
            errorMessage: err.message || 'Something went wrong. Please try again.',
            formData: req.body
        });
    }
};

exports.getLogin = async (req, res, next) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        currentPage: 'login',
        errorMessage: null
    });
};

exports.postLogin = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.getUserByEmail(email);

        if (!user || !(await argon2.verify(user.password, password))) {
            return res.status(401).render('auth/login', {
                pageTitle: 'Login',
                currentPage: 'login',
                errorMessage: 'Invalid email or password.'
            });
        }

        req.session.userUuid = user.uuid;

        req.session.save(err => {
            if (err) {
                console.error('Session save error:', err);
            }
            res.redirect('/dashboard');
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).render('auth/login', {
            pageTitle: 'Login',
            currentPage: 'login',
            errorMessage: 'An error occurred. Please try again.'
        });
    }
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout session destroy error:', err);
        }
        res.redirect('/');
    });
};