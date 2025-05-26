const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const homeController = require('../controllers/homeController');

const router = express.Router();

router.get('/', homeController.getIndex);

router.get('/dashboard', isAuthenticated, homeController.getDashboard);

router.post('/set-timezone', homeController.setTimezone);



module.exports = router