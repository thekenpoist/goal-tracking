const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/authController');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);



module.exports = router; 
