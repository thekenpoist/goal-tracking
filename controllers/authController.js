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
            res.redirect('/');
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