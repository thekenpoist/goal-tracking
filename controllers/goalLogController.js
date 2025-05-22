const { Goal, GoalLog } = require('../models');
const { DATE } = require('sequelize');
const { renderServerError } = require('../utils/errorHelpers');
const moment = require('moment');
const { buildCalendarGrid } = require('../utils/calendarBuilder');

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

        const goalLog = await GoalLog.findAll({
            where: { goalUuid }
        });

        const logDates = new Set(
            goalLog.map(log => new Date(log.sessionDate).toISOString().split('T')[0])
        );

        const targetMonthString = req.query.month;

        const [year, month] = targetMonthString?.split('-') ?? [];
        const targetDate = targetMonthString
            ? new Date(Date.UTC(parseInt(year), parseInt(month) - 1, 1))
            : new Date(); 

        const prevDate = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() - 1, 1));
        const nextDate = new Date(Date.UTC(targetDate.getUTCFullYear(), targetDate.getUTCMonth() + 1, 1));

        const formatMonthStr = (date) =>
            `${date.getUTCFullYear()}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}`;

        const prevMonthStr = formatMonthStr(prevDate);
        const nextMonthStr = formatMonthStr(nextDate);

        const {
        calendar,
        currentMonth,
        currentYear,
        currentMonthName
        } = buildCalendarGrid(new Date(targetDate));

        const goalStartDate = goal.startDate;
        const goalEndDate = goal.endDate;

        const todayStr = new Date().toISOString().split('T')[0];
        const calendarWithStatus = [];

        calendar.forEach(date => {
            const dateStr = date.toISOString().split('T')[0];
            const daysAgo = Math.floor((new Date(todayStr) - new Date(dateStr)) / (1000 * 60 * 60 * 24));

            let status;
            if (date < goalStartDate || date > goalEndDate) {
                status = 'disabled';
            } else if (logDates.has(dateStr)) {
                status = 'done';
            } else if (dateStr > todayStr) {
                status = 'future';
            } else if (daysAgo >= 7) {
                status = 'locked';
            } else {
                status = 'missed';
            }
            const isCurrentMonth = (date.getMonth() === currentMonth && date.getFullYear() === currentYear);
            calendarWithStatus.push ({ date: dateStr, status, isCurrentMonth });
        }); 

        //console.log('Target:', targetDate.toISOString());
        //console.log('Prev:', prevMonthStr, 'Next:', nextMonthStr);
        //console.log('Calendar start:', calendar[0]);
        //console.log('Calendar end:', calendar[calendar.length - 1]);
        
        res.render('partials/goals/calendar', {
            currentMonthName,
            currentYear,
            currentMonth,
            calendar: calendarWithStatus,
            prevMonthStr,
            nextMonthStr,
            layout: false,
            goalUuid,
            pageTitle: 'Goal Calendar'
        });

    } catch (err) {
        console.error('Error loading calendar', err);
        res.status(500).send('<p> class="text-red-500">Server error - something went wrong.</p>');
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