const express = require('express');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    res.status(200).json({ message: 'This is the sign up page</h1>' });
});

router.post('/login', (req, res, next) => {
    res.status(200).json({ message: 'Login page' });
});

router.post('/logout', (req, res, next) => {
    res.status(200).json({ message: 'Log out page' });
});

router.post('/forgot-password', (req, res, next) => {
    res.status(200).json({ message: 'Forgot password page' });
});

module.exports = router;