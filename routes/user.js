const express = require('express');

const router = express.Router();

router.get('/user/profile', (req, res, next) => {
    res.send('<h1>This will be the profile page</h1>');
});

router.put('/user/profile', (req, res, next) => {
    res.send('<h1>This will display the updated profile page</h1>');
});

router.delete('/user/account', (req, res, next) => {
    res.send('<h1>Accoutn deletion process will go here</h1>');
});

module.exports = router;