const { Goal, GoalLog, User } = require('../models');
const logger = require('../utils/logger');
const { evaluateStreak } = require('../utils/goalStats');
const { utcToZonedTime } = require('date-fns-tz');
const { startOfWeek } = require('date-fns');


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
            return res.status(404).send('<p> class="text-red-500">Goal Not Found</p>');
        }

        const today = utcToZonedTime(new Date(), goal.timezone);
        const sundayOfThisWeek = startOfWeek(today, { weekStartsOn: 0 });
        const sundayString = sundayOfThisWeek.toISOString().slice(0, 10);

        // console.log(`Todays's date: ${today}`);
        // console.log(`Sunday's string date: ${sundayString}`);
        // console.log(`Sunday of this week: ${sundayOfThisWeek}`);
        // console.log(`Last evaluated date: ${goal.lastEvaluatedAt}`);
        
        if (
            (!goal.lastEvaluatedAt || goal.lastEvaluatedAt < sundayString) && 
            today >= sundayOfThisWeek
        ) {
            await evaluateStreak(goal, goal.timezone);

            goal.lastEvaluatedAt = sundayString;
            await goal.save();
        }

        const logCount = await GoalLog.count({
            where: {
                userUuid: userUuid,
                goalUuid: goal.uuid
            }
        });

        goal.totalLogs = logCount;

        res.render('partials/stats/stats-details', {
            goal,
            pageTitle: `Stats: ${goal.title}`,
            layout: false
        });

    } catch (err) {
        logger.error(`Error loading stats: ${err.message}`);
        if (err.stack) {
            logger.error(err.stack);
        }

        res.status(500).send('<p> class="text-red-500">Server error loading stats</p>');
    }
}