const { validationResult } = require("express-validator");
const Goal = require("../models/goalModel");

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
    const { title, category, description, priority, startDate, endDate } = req.body;

    try {
        const newGoal = await Goal.createGoal({
            userUuid,
            title,
            category,
            description,
            priority,
            startDate,
            endDate
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error creating goal:', err.message);
        res.status(500).render('goals/new-goal', {
            pageTitle: 'New Goal',
            currentPage: 'goals',
            errorMessage: err.message,
            formData: req.body
        });
    }
};

exports.getEditGoal = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalId = parseInt(req.params.goalId);

    try {
        const goal = await Goal.getGoalById(userUuid, goalId);

        if (!goal) {
            return res.status(404).render('404', {
                pageTitle: 'Goal not found',
                currentPage: 'dashboard'
            });
        }

        res.render('goals/form-goal', {
            pageTitle: 'Edit Goal',
            currentPage: 'goals',
            formAction: `/goals/edit/${goalId}`,
            submitButtonText: 'Save Changes',
            errorMessage: null,
            formData: goal
        });
    } catch (err) {
        console.error('Error fetching goal:', err);
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            currentPage: 'dashboard'
        });
    }
};

exports.postEditGoal = async (req, res, next) => {
    const userUuid = req.session.userUuid;
    const goalId = parseInt(req.params.goalId);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('goals/form-goal', {
            pageTitle: 'Edit Goal',
            currentPage: 'goals',
            formAction: `/goals/edit/${goalId}`,
            submitButtonText: 'Save Changes',
            errorMessage: errors.array().map(e => e.msg).join(', '),
            formData: req.body
        });
    }

    try {
        const { title, category, description, priority, startDate, endDate } = req.body;

        const updatedGoal = await Goal.updateGoal(userUuid, goalId, {
            title,
            category,
            description,
            priority,
            startDate,
            endDate
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error('Error updating goal:', err.message);
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            currentPage: 'dashboard'
        });
    }
};