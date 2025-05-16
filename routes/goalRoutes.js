const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { body } = require('express-validator');
const { createGoalRules } = require('../middleware/validators/goalValidators');
const goalController = require('../controllers/goalController');

const router = express.Router();


router.get('/form-goal', isAuthenticated, goalController.getCreateGoal);
router.post('/', createGoalRules, goalController.postCreateGoal);

router.get('/edit/:goalUuid', isAuthenticated, goalController.getEditGoal);
router.post('/edit/:goalUuid', isAuthenticated, createGoalRules, goalController.postEditGoal);

router.post('/delete-goal/:goalUuid', goalController.deleteGoal);

router.get('/view/:goalUuid', isAuthenticated, goalController.viewGoalPartial);

// router.get('/:goalUuid', isAuthenticated, goalController.getShowGoal);




module.exports = router;