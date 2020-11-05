const express = require('express');
const jwt = require('jsonwebtoken');
const MongoLib = require('../lib/db/mongo');
const { config } = require('../config/index');

const confirmRegistration = (app) => {
    const router = express.Router();
    app.use('/', router);

    router.get('/confirmation/:token', async (req, res) => {
        try {
            const { userId } = jwt.verify(req.params.token, config.emailSecret);
            const mongoDB = new MongoLib();
            await mongoDB.update('users', userId, { confirmed: true });
        } catch (error) {
            res.send(error);
        }
        return res.redirect(`${config.frontURL}/login`);
    });
};

module.exports = confirmRegistration;
