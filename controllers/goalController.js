const Goal = require("../models/goalModel")

exports.getcreateGoal = (req, res, next) => {
    res.render('goals/new-goal', {
        pageTitle: "Create Goal",
        currentPage: 'goals',
        errorMessage: null,
        formData: {}
    });
};