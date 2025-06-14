const path = require('path');
const express = require('express');
const { isAuthenticated } = require('../middleware/auth/authMiddleware');
const statsController = require('../controllers/statsController');

const router = express.Router();

router.get('/partials/:goalUuid', isAuthenticated, statsController.viewStatsPartial);

module.exports = router;