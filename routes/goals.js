const express = require('express');

const router = express.Router();

router.get('/goals', (req, res, next) => {
    res.send('<h1>This is the goals page</h1>');
});

router.post('/goals', (req, res, next) => {
    res.redirect('/');
});

module.exports = router;