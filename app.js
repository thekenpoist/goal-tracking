const express = require('express');
const path = require('path');
const swaggerui = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const expressLayouts = require('express-ejs-layouts');

const errorController = require('./controllers/errorController');
const homeRouter = require('./routes/homeRoutes');
const userRouter = require('./routes/userRoutes');

const { error } = require('console');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(expressLayouts);
app.set('layout', 'layouts/main-layout');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.locals.path = req.path;
    next();
});

app.use('/profiles', userRouter);
app.use('/', homeRouter);

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

app.use(errorController.get500);
app.use(errorController.get404);

app.listen(3000);

