const path = require('path');
const express = require('express');
const { body } = require('express-validator');
const { creategoalRules } = require('../middleware/validators/goalValidator');

const goalController = require('../controllers/goalController');

const router = express.Router;

router.get('/new-goal', goalController.getCreateGoal);

router.post('/', creategoalRules, goalController.postCreateGoal);






module.exports = router;