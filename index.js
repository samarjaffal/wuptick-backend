const express = require('express');
const app = express();

const { config } = require('./config/index');

app.get('/', function (req, res) {
    res.send('hello world!');
});

app.listen(config.dbPort, function () {
    console.log(`listening http://localhost:${config.dbPort}`);
});
