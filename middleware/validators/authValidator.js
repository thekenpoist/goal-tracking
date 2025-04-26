const { body } = require('express-validator')

exports.loginRules = [
    body('email')
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 10, max: 25 }).withMessage('Password must be between 10 and 25 characters.'),
];