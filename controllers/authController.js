const { validationResult } = require("express-validator");
const User = require("../models/userModel");

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
            errorMessage: errors.array().map(e => e.msg).join(','),
            formData: req.body
        });
    }

    try {
        const { email, password } = req.body;

        const newUser = await User.addUser({
            username: '',
            email,
            passwordHash: password,
            realName: '',
            avatar: ''
        });

        req.session.userId = newUser.uuid;
        req.session.save(err => {
            if (err) {
                console.error('Session save error', err);
            }
            res.redirect('/dashboard');
        });

    } catch (err) {
        console.error('Error during signup:', err.message);
        res.status(500).render('auth/signup', {
            pageTitle: 'Sign Up',
            currentPage: 'signup',
            errorMessage: err.message || 'Something went wrong. Please try again',
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

        if (!user) {
            return res.status(401).render('auth/login', {
                pageTitle: 'Login',
                currentPage: 'login',
                errorMessage: 'Invalid email or password.'
            });
        }
        if (user.passwordHash !== password) {
            return res.status(401).render('auth/login', {
                pageTitle: 'Login',
                currentPage: 'login',
                errorMessage: 'Invalid email or password'
            });
        }

        req.session.userId = user.uuid;
        req.session.save(err => {
            if (err) {
                console.error('Session save error', err);
            }
            res.redirect('/dashboard');
        });
    } catch (err) {
        console.error('Login error', err);
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