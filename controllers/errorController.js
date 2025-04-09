// Controller for handling 404 errors
exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        currentPage: '404'
    });
};