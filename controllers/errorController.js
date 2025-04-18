// Controller for handling 404 errors
exports.get404 = (req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        currentPage: '404'
    });
};

// Controller for handling generic errors
exports.get500 = (err, req, res, next) => {
    console.error('Server Error', err.stack);
    res.status(500).render('500', {
        pageTitle: 'Server Error',
        statusCode: 500,
        message: 'An unexpected error occurred',
        err: err,
        showstack: process.env.NODE_ENV !== 'production',
        // showHomeLink: true
    });
};