const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
    res.status(200).json({ message: 'This is the goals page' });
});

router.post('/', (req, res, next) => {
    res.status(200).json({ message: 'This is the create a new goal page' });
});

module.exports = router;