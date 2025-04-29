const Goals = require('../models/goalModel');

exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'TrailTracker',
        currentPage: 'index'
         });
};

exports.getDashboard = async (req, res, next) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.redirect('/auth/login');
    }
    try{ 
        const userGoals = await Goals.getGoalsByUserId(userId);
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const sortedGoals = userGoals.sort ((a, b) => {
            return priorityOrder[a.priority.toLowerCase()] - priorityOrder[b.priority.toLowerCase()];
        });

        res.render('dashboard', {
            pageTitle: 'Your Dashboard',
            currentPage: 'dashboard',
            layout: 'layouts/dashboard-layout',
            goals: sortedGoals
        });
    } catch (err) {
        console.error('Error fetching user goals.', err);
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            currentPage: 'dashboard'
        });
    }
};