const express = require('express');

const router = express.Router();

router.get('/profile', (req, res, next) => {
    res.send('<h1>This will be the profile page</h1>');
});

router.put('/profile', (req, res, next) => {
    res.send('<h1>This will display the updated profile page</h1>');
});

router.delete('/account', (req, res, next) => {
    res.send('<h1>Account deletion process will go here</h1>');
});

module.exports = router;