const { validationResult } = require("express-validator");
const Goal = require("../models/goalModel")

exports.getCreateGoal = (req, res, next) => {
    res.render('goals/form-goal', {
        pageTitle: "Create New Goal",
        currentPage: 'goals',
        formAction: '/goals',
        submitButtonText: 'Create Goal',
        errorMessage: null,
        formData: {
            userId: req.params.userId || ''
        }
    });
};

exports.postCreateGoal = async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('goals/new-goal', {
            pageTitle: 'Create Goal',
            currentPage: 'goals',
            errorMessage: errors.array().map(e => e.msg).join(','),
            formData: req.body
        });
    }

    const userId = req.session.userId;
    const { title, category, description, priority, startDate, endDate } = req.body;

    try {
        const newGoal = await Goal.createGoal({
            userId, 
            title, 
            category, 
            description, 
            priority, 
            startDate, 
            endDate
        });
        res.redirect(`/goals/${userId}`);
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

exports.