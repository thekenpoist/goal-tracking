const express = require('express');
const bodyParser = require('body-parser');
const swaggerui = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

const authRouter = require('./routes/auth');
const goalsRouter = require('./routes/goals');
const userRouter = require('./routes/users');
const indexRouter = require('./routes/index');

app.use('/auth', authRouter);
app.use('/goals', goalsRouter);
app.use('/users', userRouter);
app.use('/', indexRouter);

app.use('/api-docs', swaggerui.serve, swaggerui.setup(swaggerDocument));

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.status(404).json({ error: 'Page not found' });
});



app.listen(3000);

