const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const { body } = require('express-validator');
const goalLogController = require('../controllers/goalLogController');

const router = express.Router();


router.get('/partials/calendar/:goalUuid', isAuthenticated, goalLogController.getGoalLog);

router.post('/', isAuthenticated, goalLogController.postGoalLog);

router.post('/:goalLogUuid', isAuthenticated, goalLogController.deleteGoalLog);
