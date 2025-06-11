const { Goal, GoalLog, User } = require('../models');
const logger = require('../utils/logger');
const { renderServerError } = require('../utils/errorHelpers');


exports.viewStatsPartial = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;

    try {
        const goal = await Goal.findOne({
            where: {
                userUuid,
                uuid: goalUuid
            }
        });

        if (!goal) {
            return res.status(404).send('<p class="text-red-500">Goal Not Found</p>');
        }
    } catch (err) {
        logger.error(`Error loading stats: ${err.message}`);
        if (err.stack) {
            logger.error(err.stack);
        }
        
        res.status(500).send('<p> class="text-red-500">Server error loading stats</p>');
    }
    
}