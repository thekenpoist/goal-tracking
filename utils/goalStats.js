const { Op } = require('sequelize');
const { Goal, GoalLog } = require('../models');
const { getWeekRange } = require('../utils/timeUtils');

async function updateLastLoggedAt(goalUuid, userUuid) {
    const latestLog = await GoalLog.findOne({
        where: { goalUuid, userUuid },
        order: [['sessionDate', 'DESC']]
    });

    const goal = await Goal.findOne({ where: { uuid: goalUuid, userUuid }});
    if (!goal) return;

    goal.lastLoggedAt = latestLog ? latestLog.sessionDate : null;
    await goal.save();
}


async function evaluateStreak(goal, timezone = 'UTC') {
    const offset = goal.streakCounter + 1;
    const { weekStart, weekEnd } = getWeekRange(offset, timezone);
    
    const logCount = await GoalLog.count({
        where: {
            goalUuid: goal.uuid,
            userUuid: goal.userUuid,
            sessionDate: {
                [Op.between]: [weekStart, weekEnd]
            }
        }
    });

    if (logCount >= goal.frequency) {
        goal.streakCounter++;
        if (goal.streakCounter > goal.longestStreak) {
            goal.longestStreak = goal.streakCounter;
        } 
    } else {
        if (goal.streakCounter > goal.longestStreak) {
            goal.longestStreak = goal.streakCounter;
        }
        goal.streakCounter = 0;
    }


}

module.exports = { 
    updateLastLoggedAt,
    evaluateStreak
 };


