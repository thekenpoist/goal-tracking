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

        res.render('dashboard', {
            pageTitle: 'Your Dashboard',
            currentPage: 'dashboard',
            layout: 'layouts/dashboard-layout',
            goals: userGoals
        });
    } catch (err) {
        console.error('Error fetching user goals.', err);
        res.status(500).render('500', {
            pageTitle: 'Server Error',
            currentPage: 'dashboard'
        });
    }
};