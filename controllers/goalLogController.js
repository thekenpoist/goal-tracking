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
        const endDate = goal.endDate;

        const calendar = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            calendar.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        const goalLog = await GoalLog.findAll({
            where: { goalUuid }
        });

        const logDates = new Set(
            goalLog.map(log => new Date(log.sessionDate).toISOString().split('T')[0])
        );

        const todayStr = new Date().toISOString().split('T')[0];
        const calendarWithStatus = [];

        calendar.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            const daysAgo = Math.floor((new Date(todayStr) - new Date(dateStr)) / (1000 * 60 * 60 * 24));

            let status;
            if (logDates.has(dateStr)) {
                status = 'done';
            } else if (dateStr > todayStr) {
                status = 'future';
            } else if (daysAgo >= 7) {
                status = 'locked';
            } else {
                status = 'missed';
            }

            calendarWithStatus.push ({ date: dateStr, status });
        }); 

        res.render('partials/goalLogs/calendar', {
            calendar: calendarWithStatus,
            layout: false,
            pageTitle: 'Goal Calendar'
        });

    } catch (err) {
        console.error('Error loading calendar', err);
        res.status(500).send('<p> classe="text-red-500">Server error - something went wrong.</p>');
    }
};

exports.toggleGoalLog = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;
    const goalLogUuid = req.params.goalLogUuid;

    if (!userUuid) {
        return res.render('/auth/login');
    }

};