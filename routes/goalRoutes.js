const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { body } = require('express-validator');
const { createGoalRules } = require('../middleware/validators/goalValidators');
const goalController = require('../controllers/goalController');

const router = express.Router();

router.get('/show-goal:goalId', goalController.getShowGoal);

router.get('/form-goal', isAuthenticated, goalController.getCreateGoal);
router.post('/', createGoalRules, goalController.postCreateGoal);

router.get('/edit/:goalId', isAuthenticated, goalController.getEditGoal);
router.post('/edit/:goalId', isAuthenticated, createGoalRules, goalController.postEditGoal);






module.exports = router;