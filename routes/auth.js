const express = require('express');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    res.send('<h1>This is the sign up page</h1>');
});

router.post('/login', (req, res, next) => {
    res.send('<h1>Login page</h1>');
});

router.post('/logout', (req, res, next) => {
    res.send('<h1>Log out page</h1>');
});

router.post('/forgot-password', (req, res, next) => {
    res.send('<h1>Forgot password page</h1>');
});

module.exports = router;