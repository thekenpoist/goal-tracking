const express = require('express');

const router = express.Router();

router.get('/profile', (req, res, next) => {
    res.status(200).json({ message: 'This will be the profile page' });
});

router.put('/profile', (req, res, next) => {
    res.status(200).json({ message: 'This will display the updated profile page' });
});

router.delete('/account', (req, res, next) => {
    res.status(200).json({ message: 'Account deletion process will go here' });
});

module.exports = router;