const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { body } = require('express-validator');
const { createGoalRules } = require('../middleware/validators/goalValidators');
const goalController = require('../controllers/goalController');

const router = express.Router();

// Create
router.get('/new', isAuthenticated, goalController.getCreateGoal);
router.post('/', createGoalRules, goalController.postCreateGoal);

// Read
router.get('/partials/:goalUuid', isAuthenticated, goalController.viewGoalPartial);

// Update
router.get('/edit/:goalUuid', isAuthenticated, goalController.getEditGoal);
router.post('/edit/:goalUuid', isAuthenticated, createGoalRules, goalController.postEditGoal);

// Delete
router.post('/delete/:goalUuid', isAuthenticated, goalController.deleteGoal);



module.exports = router;