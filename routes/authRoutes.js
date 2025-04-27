const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const { signupRules, loginRules } = require('../middleware/validators/authValidators');

const authController = require('../controllers/authController');

const router = express.Router();

router.get('/dashboard', authController.getDashboard);

router.get('/auth/signup', authController.getSignup);
router.post('/auth/signup', signupRules, authController.postSignup);

router.get('/auth/login', authController.getLogin);
router.post('/auth/login', loginRules, authController.postLogin);





module.exports = router; 
