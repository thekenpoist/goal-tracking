const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { body } = require('express-validator');
const { createGoalRules } = require('../middleware/validators/goalValidators');
const goalController = require('../controllers/goalController');

const router = express.Router();

router.get('/new-goal', isAuthenticated, goalController.getCreateGoal);

router.post('/', createGoalRules, goalController.postCreateGoal);






module.exports = router;