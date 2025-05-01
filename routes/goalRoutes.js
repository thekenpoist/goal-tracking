const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { body } = require('express-validator');
const { createGoalRules } = require('../middleware/validators/goalValidators');
const goalController = require('../controllers/goalController');

const router = express.Router();


router.get('/form-goal', isAuthenticated, goalController.getCreateGoal);
router.post('/', createGoalRules, goalController.postCreateGoal);

router.get('/edit/:goalId', isAuthenticated, goalController.getEditGoal);
router.post('/edit/:goalId', isAuthenticated, createGoalRules, goalController.postEditGoal);

router.post('/delete-goal/:goalId', goalController.deleteGoal);

router.get('/view/:goalId', isAuthenticated, goalController.viewGoalPartial);

// router.get('/:goalId', isAuthenticated, goalController.getShowGoal);




module.exports = router;