const express = require('express');

const router = express.Router();

router.post('/auth/signup', (req, res, next) => {
    res.redirect('/');
});

router.post('/auth/login', (req, res, next) => {
    res.redirect('/');
});

router.post('/auth/logout', (req, res, next) => {
    res.redirect('/');
});

module.exports = router;