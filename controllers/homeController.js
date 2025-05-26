const { Goal } = require('../models');

exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'TrailTracker',
        currentPage: 'index'
    });
};

exports.getDashboard = async (req, res, next) => {
    const userUuid = req.session.userUuid;

    if (!userUuid) {
        return res.redirect('/auth/login');
    }

    try { 
        const userGoals = await Goal.findAll({
            where: { userUuid }
        });

        // Sort goals by priority: high → medium → low
        const priorityOrder = { high: 1, medium: 2, low: 3 };
        const sortedGoals = userGoals.sort((a, b) => {
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
            currentPage: 'dashboard',
            message: err.message,
            showstack: process.env.NODE_ENV !== 'production', err
        });
    }
};

exports.setTimezone = (req, res) => {
    const { timezone } = req.body;

    if (!timezone) {
        return res.status(400).json({ error: "Unable to retrieve timezone "});
    }

    req.session.timezone = timezone;
    console.log(`Timezone set for session: ${timezone}`);

    res.status(200).json({ message: 'TimeZone updataed'});
}