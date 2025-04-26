const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const { addUserRules, editUserRules } = require('../middleware/validators/userValidators');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/new-profile', userController.getAddUser);
router.post('/', addUserRules, userController.postAddUser);

router.get('/edit-profile/:userId', userController.getEditUser);
router.post('/edit-profile/:userId', editUserRules,userController.postEditUser);

router.post('/delete-user/:userId', userController.deleteUser);




router.get('/:userId', userController.getUserById);

module.exports = router; 
