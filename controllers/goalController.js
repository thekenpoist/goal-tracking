const { validationResult } = require("express-validator");
const { Goal, GoalLog, User } = require('../models');
const { DATE } = require("sequelize");
const { renderServerError } = require('../utils/errorHelpers');
const { getGoalLogsThisWeek } = require('../utils/goalHelpers');
const { formatInTimeZone } = require('date-fns-tz');
const { constructFromSymbol } = require("date-fns/constants");
const logger = require('../utils/logger')
const { normalizeDate } = require('../utils/timeUtils');

exports.getShowGoal = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;

    if (!userUuid) {
        return res.redirect('/auth/login');
    }

    try {
        const goal = await Goal.findOne({
            where: {
                userUuid,
                uuid: goalUuid
            }
        });

        if (!goal) {
            return res.status(404).render('404', {
                pageTitle: "Goal not found",
                currentPage: 'dashboard'
            });
        }
        res.render('goals/show-goal', {
            pageTitle: 'View Goal',
            currentPage: 'goal',
            layout: 'layouts/dashboard-layout',
            errorMessage: null,
            formData: goal
        });
    } catch (err) {
        logger.error(`Error fetching goal: ${err.message}`);
        if (err.stack) {
            logger.error(err.stack);
        }

        return renderServerError(res, err, 'dashboard');
    }
};

exports.viewGoalPartial = async (req, res, next) => {
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

        const user = await User.findOne({ where: { uuid: userUuid } });
        const timezone = user?.timezone || 'UTC';

        const goalLogs = await GoalLog.findAll({
            where: {
                goalUuid: goal.uuid,
                userUuid
            }
        });

        // Set a fake date
        // comment out or null in production
        const testOverrideDate = '2025-06-17'; 
        const logsThisWeek = getGoalLogsThisWeek(goalLogs, timezone, testOverrideDate);

        // Uncomment below for production
        // const logsThisWeek = getGoalLogsThisWeek(goalLogs, timezone);

        const sortedLogs = logsThisWeek.sort((a, b) => a.sessionDate.localeCompare(b.sessionDate));
        // console.log('✅ Sorted Logs This Week:', sortedLogs);
        const achievedDate = sortedLogs[goal.frequency - 1]?.sessionDate;

        // Safety check
        if (sortedLogs.length >= goal.frequency) {
            const achievedDate = sortedLogs[goal.frequency - 1].sessionDate;
            //console.log('✅ Sorted Logs This Week:', sortedLogs.map(l => l.sessionDate));
            //console.log('🎯 Goal frequency per week:', goal.frequency);
            //console.log('📅 Weekly goal achieved at date:', achievedDate);
        }

        if (logsThisWeek.length >= goal.frequency) {
            if (!goal.wasAchievedAt || goal.wasAchievedAt !== achievedDate) {
                goal.wasAchievedAt = achievedDate;
                //console.log(`Goal frequency per week: ${goal.frequency}`);
                //console.log(`Weekly goal achieved at date: ${goal.wasAchievedAt}`);
                await goal.save();
            }
        } else {
            if (goal.wasAchievedAt) {
                goal.wasAchievedAt = null;
                //console.log(`Resetting goal achieved at to null: ${goal.wasAchievedAt}`);
                await goal.save();
            }
        }

        
        goal.startDateFormatted = goal.startDate;
        goal.endDateFormatted = goal.endDate;
        goal.wasAchievedAtFormatted = goal.wasAchievedAt
            ? formatInTimeZone(goal.wasAchievedAt, timezone, 'MMMM d, yyyy')
            : null;

        res.render('partials/goals/goal-details', {
            goal,
            pageTitle: `Goal: ${goal.title}`,
            layout: false
        });
    } catch (err) {
        logger.error(`Error loading goal details. ${err.message}`);
            if (err.stack) {
                logger.error(err.stack);
            }

        res.status(500).send('<p> class="text-red-500">Server error loading goal</p>');
    }
};

exports.getCreateGoal = (req, res, next) => {
    res.render('goals/form-goal', {
        pageTitle: "Create New Goal",
        currentPage: 'goals',
        formAction: '/goals',
        submitButtonText: 'Create Goal',
        errorMessage: null,
        formData: {
            userUuid: req.session.userUuid || ''
        }
    });
};

exports.postCreateGoal = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('goals/new-goal', {
            pageTitle: 'Create Goal',
            currentPage: 'goals',
            errorMessage: errors.array().map(e => e.msg).join(', '),
            formData: req.body
        });
    }

    const userUuid = req.session.userUuid;
    const { 
        title, 
        category, 
        description, 
        priority, 
        startDate, 
        endDate,
        frequency,
        duration
    } = req.body;

    const normalizeStartDate = normalizeDate(startDate);
    const normalizeEndDate = normalizeDate(endDate);

    try {
        const newGoal = await Goal.create({
            userUuid,
            title,
            category,
            description,
            priority,
            startDate: normalizeStartDate,
            endDate: normalizeEndDate,
            frequency,
            duration
        });

        res.redirect('/dashboard');
    } catch (err) {
        logger.error(`Error creating goal: ${err.message}`);
            if (err.stack) {
                logger.error(err.stack);
            }
        res.status(500).render('goals/new-goal', {
            pageTitle: 'Create Goal',
            currentPage: 'goals',
            formAction: '/goals',
            submitButtonText: 'Create Goal',
            errorMessage: 'Failed to create goal',
            formData: req.body
        });
    }
};

exports.getEditGoal = async (req, res, next) => {
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
            return res.status(404).render('404', {
                pageTitle: 'Goal not found',
                currentPage: 'dashboard'
            });
        }

        res.render('goals/form-goal', {
            pageTitle: 'Edit Goal',
            currentPage: 'goals',
            layout: 'layouts/dashboard-layout',
            formAction: `/goals/edit/${goalUuid}`,
            submitButtonText: 'Save Changes',
            errorMessage: null,
            formData: goal
        });
    } catch (err) {
        logger.error(`Error fetching goal: ${err.message}`);
            if (err.stack) {
                logger.error(err.stack);
            }
        return renderServerError(res, err, 'dashboard');
    }
};

exports.postEditGoal = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('goals/form-goal', {
            pageTitle: 'Edit Goal',
            currentPage: 'goals',
            layout: 'layouts/dashboard-layout',
            formAction: `/goals/edit/${goalUuid}`,
            submitButtonText: 'Save Changes',
            errorMessage: errors.array().map(e => e.msg).join(', '),
            formData: req.body
        });
    }

    try {
        const goal = await Goal.findOne({
            where: {
                userUuid,
                uuid: goalUuid
            }
        });

        if (!goal) {
            return res.status(404).render('404', {
                pageTitle: 'Goal Not Found',
                currentPage: 'dashboard'
            });
        }
        const {
            title,
            category,
            description,
            priority,
            startDate,
            endDate,
            frequency,
            duration,
            isCompleted,
            wasAchieved
        } = req.body;

        const normalizeStartDate = normalizeDate(startDate);
        const normalizeEndDate = normalizeDate(endDate);

        await Goal.update({
            title,
            category,
            description,
            priority,
            startDate: normalizeStartDate,
            endDate: normalizeEndDate,
            frequency,
            duration,
            isCompleted: isCompleted === 'on'  || isCompleted === true,
            wasAchieved: wasAchieved === 'on' || wasAchieved === true,
            updatedAt: new Date()
        }, {
            where: {
                userUuid,
                uuid: goalUuid
            } 
        });

        res.redirect('/dashboard');
    } catch (err) {
        logger.error(`Error updating goal: ${err.message}`);
            if (err.stack) {
                logger.error(err.stack);
            }
        return renderServerError(res, err, 'dashboard');
    }
};

exports.deleteGoal = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalUuid = req.params.goalUuid;

    try {
        const deleted = await Goal.destroy({
            where: {
                userUuid,
                uuid: goalUuid
            }
        });

        if (!deleted) {
            return res.status(404).render('404', {
                pageTitle: 'Goal Not Found',
                currentPage: 'dashboard'
            });
        }

        res.redirect('/dashboard');
    } catch (err) {
        logger.error(`Error deleting goal ${err.message}`);
            if (err.stack) {
                logger.error(err.stack);
            }
            
        return renderServerError(res, err, 'dashboard');
    }
};