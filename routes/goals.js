const express = require('express');

const router = express.Router();

router.get('/goals', (req, res, next) => {
    res.send('<h1>This is the goals page</h1>');
});

router.post('/goals', (req, res, next) => {
    res.send('<h1>This is the create a new goal page</h1>');
});

module.exports = router;