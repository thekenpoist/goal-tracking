exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'TrailTracker',
        currentPage: 'index'
         });
};

exports.getDashboard = (req, res, next) => {
    res.render('dashboard', {
        pageTitle: 'Your Dashboard',
        currentPage: 'dashboard',
        layout: 'layouts/dashboard-layout'
    });
};