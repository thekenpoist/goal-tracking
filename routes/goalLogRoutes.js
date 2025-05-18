const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { body } = require('express-validator');
const goalLogController = require('../controllers/goalLogController');

const router = express.Router();


router.get('/partials/calendar', isAuthenticated, goalLogController.getGoalLog);

router.post('/partials/goal-logs:goalLogUuid', isAuthenticated, goalLogController.postGoalLog);

router.post('/delete/:goalLogUuid', isAuthenticated, goalLogController.deleteGoalLog);
