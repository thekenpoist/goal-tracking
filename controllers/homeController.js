exports.getIndex = (req, res, next) => {
    res.render('index', {
        pageTitle: 'TrailTracker',
        currentPage: 'index'
         });
};