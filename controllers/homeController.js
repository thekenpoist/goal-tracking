const Goals = require('../models/goalModel');

exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'TrailTracker',
        currentPage: 'index'
         });
};

exports.getDashboard = (req, res, next) => {
    const userId = req.session.userId;
    const userGoals = Goals.getGoalsByUserId(userId);

    res.render('dashboard', {
        pageTitle: 'Your Dashboard',
        currentPage: 'dashboard',
        layout: 'layouts/dashboard-layout',
        goals: userGoals
    });
};