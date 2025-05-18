const { GoalLog } = require('../models');
const { Goal } = require('../models');
const { DATE } = require('sequelize');
const { renderServerError } = require('../utils/errorHelpers');

exports.getCalendar = async (res, req, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;

    if (!userUuid) {
        return res.render('/auth/login');
    }

    try {
        const goalLog = await GoalLog.findall({
            where: {
                goalUuid
            }
        });
    }

    if (!goalLog) {
        return res.status(404).send('<p class="text-red-500">No goals logged.</p>');
    }

};

exports.postGoalLog = async (res, req, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;
    const goalLogUuid = req.params.goalLogUuid;

    if (!userUuid) {
        return res.render('/auth/login');
    }

};
