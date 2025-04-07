const express = require('express');
const path = require('path');
const swaggerui = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const expressLayouts = require('express-ejs-layouts');


//const authRouter = require('./routes/auth');
//const goalsRouter = require('./routes/goals');
//const userRouter = require('./routes/users');
const homeRouter = require('./routes/homeRoutes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layout');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

//app.use('/auth', authRouter);
//app.use('/goals', goalsRouter);
//app.use('/users', userRouter);
app.use('/', homeRouter);

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));


app.use((req, res, next) => {
    res.status(404).json({ error: 'Page not found' });
});


app.listen(3000);

