const express = require('express');

const app = express();

app.use('/user', (req, res, next) => {
    console.log('User middleware');
    res.send('<h1>User page!</h1>');
});

app.use('/', (req, res, next) => {
    console.log('Home middleware!');
    res.send('<h1>Home page!</h1>');
});

app.listen(3000)

