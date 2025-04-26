const path = require('path');
const express = require('express');
const { body } = require('express-validator');

const userController = require('../controllers/userController');

const router = express.Router();

router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);



module.exports = router; 
