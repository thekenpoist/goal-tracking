const path = require('path');
const express = require('express');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/new-profile', userController.getAddUser);
router.get('/:userId', userController.getUserById);

router.post('/', userController.postAddUser);

router.get('/edit-profile:userId', userController.getEditUser);

router.post('edit-profile:userId', userController.postEditUser);


module.exports = router;
