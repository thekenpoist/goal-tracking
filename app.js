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

const { error } = require('console');
const User = require('./models/userModel');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.use(session({
    secret: '4d3bca5fa3e385395f69bac991078cef4eef4be66f1f816503bdc0a8359639f14a9618efa3efbd3646e5ebab9343c327516c48e195ef8397adaf70077a4de836',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use(async (req, res, next) => {
    res.locals.currentPage = '';  // default to empty string to avoid undefined errors in views

    if (!req.session.userId) {
        res.locals.currentUser = null;
        return next();
    }

    try {
        const user = await User.getUserById(req.session.userId);
        res.locals.currentUser = user;
    } catch (err) {
        console.error('Error loading current user for session', err);
        res.locals.currentUser = null;
    }
    next();
});

app.use('/profiles', userRouter);
app.use('/', homeRouter);
app.use('/goals', goalRouter);
app.use(authRouter);

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

app.use(errorController.get500);
app.use(errorController.get404);

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

