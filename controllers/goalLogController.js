const { GoalLog } = require('../models');
const { Goal } = require('../models');
const { DATE } = require('sequelize');
const { renderServerError } = require('../utils/errorHelpers');


exports.getCalendarPartial = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;

    if (!userUuid) {
        return res.render('/auth/login');
    }

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
        const startDate = goal.startDate;
        const endDate = goal.endDate
    }

    try {
        const goalLog = await GoalLog.findall({
            where: {
                goalUuid
            }
        });

        if (!goalLog) {
            return res.status(404).send('<p class="text-red-500">No calendar to display..</p>');
        }
    } catch (err) {
        console.error('Error loading calendar.', err);
        res.status(500).send('<p> classe="text-red-500">Server error loading calendar</p>');
    }

};

exports.postGoalLog = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;
    const goalLogUuid = req.params.goalLogUuid;

    if (!userUuid) {
        return res.render('/auth/login');
    }

};
