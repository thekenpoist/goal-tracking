const { validationResult } = require("express-validator");
const { Goal, GoalLog, User } = require('../models');
const { DATE } = require("sequelize");
const { renderServerError } = require('../utils/errorHelpers');
const { getGoalLogsThisWeek, getCurrentCalendarWeek } = require('../utils/goalHelpers');
const { formatInTimeZone } = require('date-fns-tz');
const { constructFromSymbol } = require("date-fns/constants");

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
        console.error('Error fetching goal:', err);
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

        const { startOfWeek, endOfWeek } = getCurrentCalendarWeek(timezone);

        if (goal.wasAchievedAt) {
            const achievedAt = new Date(goal.wasAchievedAt);
            if (achievedAt < startOfWeek || achievedAt > endOfWeek) {
                console.log(`Resetting wasAchieveAt for ${goal.title}`);
                goal.wasAchievedAt = null;
                await goal.save();
            }
        }

        const goalLogs = await GoalLog.findAll({
            where: {
                goalUuid: goal.uuid,
                userUuid
            }
        });

        const logsThisWeek = getGoalLogsThisWeek(goalLogs, timezone);
        //console.log(logsThisWeek.length);
        //console.log(goal.frequency);
        //console.log(goal.wasAchievedAt);

        if (logsThisWeek.length >= goal.frequency) {
            const targetLog = logsThisWeek[goal.frequency - 1];
            if (targetLog) {
                goal.wasAchievedAt = targetLog.sessionDate;
                console.log(`Setting wasAchievedAt for ${goal.title} at ${goal.wasAchievedAt}`);
                await goal.save();
            }
        } else {
            goal.wasAchievedAt = null;
            await goal.save();
        }
        
        goal.startDateFormatted = goal.startDate;
        goal.endDateFormatted = goal.endDate;
        goal.wasAchievedAtFormatted = goal.wasAchievedAt
            ? formatInTimeZone(goal.wasAchievedAt, timezone, 'MMMM d, yyyy')
            : null;
        console.log(`Using ${timezone} for goals`);

        res.render('partials/goal-details', {
            goal,
            pageTitle: `Goal: ${goal.title}`,
            layout: false
        });
    } catch (err) {
        console.error('Error loading goal details.', err);
        res.status(500).send('<p> classe="text-red-500">Server error loading goal</p>');
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

    try {
        const newGoal = await Goal.create({
            userUuid,
            title,
            category,
            description,
            priority,
            startDate,
            endDate,
            frequency,
            duration
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error creating goal:', err);
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
        console.error('Error fetching goal:', err);
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

        await Goal.update({
            title,
            category,
            description,
            priority,
            startDate,
            endDate,
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
        console.error('Error updating goal:', err.message);
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
        console.error('Error deleting goal', err);
        return renderServerError(res, err, 'dashboard');
    }
};