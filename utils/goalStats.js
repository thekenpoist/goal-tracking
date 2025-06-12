const { Goal, GoalLog } = require('../models');

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


async function evaluateStreak(goalUuid, userUuid, ) {
    const numberOfLogs = await GoalLog.findAll
}
module.exports = { updateLastLoggedAt };


