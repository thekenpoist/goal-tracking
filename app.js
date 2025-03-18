const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const authRoutes = require('./routes/auth');
const goalsRoutes = require('./routes/goals');
const userRoutes = require('./routes/user');

app.use(bodyParser.urlencoded({extended: false}));

app.use(authRoutes);
app.use(goalsRoutes);
app.use(userRoutes);

app.use((req, res, next) => {
    res.status(404).send('<h1>Page not found</h1>');
});

app.listen(3000)

