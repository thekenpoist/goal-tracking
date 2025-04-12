const path = require('path');
const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/new-profile', userController.getAddUser);

router.post('/', userController.postAddUser);

router.get('/:userId', userController.getUserById)


module.exports = router;
