const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { editUserRules, updateSettingsRules } = require('../middleware/validators/userValidators');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/edit-profile', userController.getEditUser);
router.post('/edit-profile', editUserRules, userController.postEditUser);

router.get('/settings', isAuthenticated, userController.getSettingsPage);
router.post('/settings', isAuthenticated, updateSettingsRules, userController.postUpdateEmailOrPassword);
router.post('/delete-user', userController.deleteUser);

router.get('/me', userController.getShowProfile);

router.get('/:uuid', userController.getUserByUUID);

module.exports = router; 
