const { Goal, GoalLog, User } = require('../models');
const { DATE } = require('sequelize');
const { renderServerError } = require('../utils/errorHelpers');
const moment = require('moment');
const { buildCalendarGrid } = require('../utils/calendarBuilder');
const { utcToZonedTime } = require('date-fns-tz');
const { utcToZonedTimeWithOptions } = require('date-fns-tz/fp');
const logger = require('../utils/logger');


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
        
        const user = await User.findOne({ 
            where: { uuid: userUuid }
        });
        const timezone = user?.timezone || 'UTC';

        let targetMonthString = req.query.month;

        if (!targetMonthString) {
            const now = utcToZonedTime(new Date(), timezone);
            targetMonthString = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
        }
        
        const [yearStr, monthStr] = targetMonthString?.split('-');
        const year = parseInt(yearStr);
        const month = parseInt(monthStr) - 1;
        const targetDate = new Date(year, month, 15, 12);

        const prevDate = new Date(year, month -1, 1);
        const nextDate = new Date(year, month + 1, 1);

        const formatMonthStr = (date) =>
            `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        const prevMonthStr = formatMonthStr(prevDate);
        const nextMonthStr = formatMonthStr(nextDate);

        const goalLog = await GoalLog.findAll({
            where: { goalUuid }
        });

        const logDates = new Set(goalLog.map(log => log.sessionDate));

        const {
        calendar,
        currentMonth,
        currentYear,
        currentMonthName
        } = buildCalendarGrid(new Date(targetDate), timezone);

        const now = utcToZonedTime(new Date(), timezone);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Clean today at 00:00
        const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        const sevenDaysAgoStr = `${sevenDaysAgo.getFullYear()}-${(sevenDaysAgo.getMonth() + 1).toString().padStart(2, '0')}-${sevenDaysAgo.getDate().toString().padStart(2, '0')}`;

        const calendarWithStatus = calendar.map(date => {
            const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
            
            let status;
            if (dateStr < goal.startDate || dateStr > goal.endDate) {
                status = 'disabled';
            } else if (dateStr > todayStr) {
                status = 'future'
            } else if (dateStr < sevenDaysAgoStr) {
                console.log(dateStr, sevenDaysAgoStr, goal.startDate);
                status = logDates.has(dateStr) ? 'done-locked' : 'missed-locked';
            } else if (logDates.has(dateStr)) {
                status = 'done';
            } else {
                status = 'missed';
            }

            const isCurrentMonth = (date.getMonth() === currentMonth && date.getFullYear() === currentYear);

            return { date: dateStr, status, isCurrentMonth };
        }); 

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
        logger.error(`Error loading calendar ${err.message}`);
        if (err.stack) {
            logger.error(err.stack);
        }

        res.status(500).send('<p> class="text-red-500">Server error - something went wrong.</p>');
    }
};

exports.toggleGoalLog = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;
    let sessionDate = req.params.date;

    if (!userUuid) {
        return res.render('/auth/login');
    }

    try {
        const goal = await Goal.findOne({
            where: {
                uuid: goalUuid,
                userUuid: userUuid
            }
        });

        if (!goal) {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        const existingLog = await GoalLog.findOne({
            where: {
                userUuid,
                goalUuid,
                sessionDate
            }
        });

        if (existingLog) {
            await existingLog.destroy();
            return res.status(200).json({ toggled: false });
        } else {
            await GoalLog.create({
                userUuid,
                goalUuid,
                sessionDate
            });
            return res.status(200).json({ toggled: true });
        }
    } catch (err) {
        logger.error(`Error toggling goal log: ${err.message}`);
        if (err.stack) {
            logger.error(err.stack);
        }
        return res.status(500).json({ error: 'Server error '});
    }
};