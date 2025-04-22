const Goal = require("../models/goalModel")

exports.getCreateGoal = (req, res, next) => {
    res.render('goals/new-goal', {
        pageTitle: "Create Goal",
        currentPage: 'goals',
        errorMessage: null,
        formData: {}
    });
};