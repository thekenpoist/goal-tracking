const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/new-profile', userController.getAddUser);


router.post('/', [
    body('username')
        .isLength({ min: 4, max: 50 }).withMessage('Username must be between 4 and 50 characters.'),
    body('email')
        .isEmail().withMessage('A valid email is required.')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 10, max: 25 }).withMessage('Password must be between 10 and 25 characters.'),
    body('realName')
        .optional({ checkFalsy: true })
        .isLength({ max: 50 }).withMessage('Real name must be less than 50 characters.'),
    body('avatar')
        .optional({ checkFalsy: true })
        .isURL().withMessage('Avatar must be a valid URL.')
        .isLength({ max: 2048 }).withMessage('Avatar URL is too long.')

], userController.postAddUser);


router.get('/edit-profile/:userId', userController.getEditUser);

router.post('/edit-profile/:userId', userController.postEditUser);

router.post('/delete-user/:userId', userController.deleteUser);




router.get('/:userId', userController.getUserById);

module.exports = router;
