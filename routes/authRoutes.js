const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const { signupRules, loginRules } = require('../middleware/validators/authValidators');

const authController = require('../controllers/authController');

const router = express.Router();

router.get('/signup', authController.getSignup);
router.post('/signup', signupRules, authController.postSignup);

router.get('/login', authController.getLogin);
router.post('/login', loginRules, authController.postLogin);





module.exports = router; 
