const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const { addUserRules, editUserRules } = require('../middleware/validators/userValidators');

const userController = require('../controllers/userController');

const router = express.Router();

//router.get('/new-profile', userController.getAddUser);
//router.post('/', addUserRules, userController.postAddUser);

router.get('/edit-profile/:uuid', userController.getEditUser);
router.post('/edit-profile/:uuid', editUserRules,userController.postEditUser);

router.post('/delete-user/:uuid', userController.deleteUser);


router.get('/me', userController.getShowProfile);

router.get('/:uuid', userController.getUserByUUID);

module.exports = router; 
