const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const authRouter = require('./routes/auth');
const goalsRouter = require('./routes/goals');
const userRouter = require('./routes/user');
const indexRouter = require('./routes/index');

app.use('/auth', authRouter);
app.use('/goals', goalsRouter);
app.use('/user', userRouter);
app.use('/', indexRouter);

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});



app.listen(3000);

