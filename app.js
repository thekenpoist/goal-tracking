const express = require('express');
const path = require('path');
const swaggerui = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');

const errorController = require('./controllers/errorController');
const homeRouter = require('./routes/homeRoutes');
const userRouter = require('./routes/userRoutes');
const goalRouter = require('./routes/goalRoutes');
const authRouter = require('./routes/authRoutes');
const goalLogRouter = require('./routes/goalLogRoutes');
const statsRouter = require('./routes/statsRoutes');

const logger = require('./utils/logger'); 

const { User } = require('./models');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));

// Set path as local variable for active nav highlighting
app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

// Set currentUser and layout from session
app.use(async (req, res, next) => {
    res.locals.currentPage = '';
    res.locals.currentUser = null;
    res.locals.layout = 'layouts/main-layout';
    res.locals.session = req.session;

    const uuid = req.session.userUuid;

    if (uuid) {
        try {
            const user = await User.findOne({ where: { uuid: req.session.userUuid } });
            if (user) {
                res.locals.currentUser = user;
                res.locals.layout = 'layouts/dashboard-layout';
            }
        } catch (err) {
            console.error('Error loading current user from session:', err);
            res.locals.currentUser = null;
        }
    }

    next();
});

// Mount routes
app.use('/profiles', userRouter);
app.use('/', homeRouter);
app.use('/goals', goalRouter);
app.use('/auth', authRouter);
app.use('/goal-logs', goalLogRouter);
app.use('/stats', statsRouter);

// Swagger docs
app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

// Error handlers
app.use(errorController.get500);
app.use(errorController.get404);

// Start server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});