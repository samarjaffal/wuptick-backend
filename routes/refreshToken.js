const express = require('express');
const jwt = require('jsonwebtoken');
const MongoLib = require('../lib/db/mongo');
const { config } = require('../config/index');
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} = require('../shared/tokens');
const { ObjectID } = require('mongodb');

const refreshToken = (app) => {
    const router = express.Router();
    app.use('/', router);

    router.post('/refresh_token', async (req, res) => {
        //console.log(req.cookies);
        const refreshToken = req.cookies.wtid;

        if (!refreshToken) {
            return res.send({ ok: false, token: '' });
        }

        let payload = null;

        try {
            payload = jwt.verify(refreshToken, config.rfToken);
        } catch (error) {
            console.log('error', error);
            return res.send({ ok: false, token: '' });
        }

        //token is valid

        //find a user with the id
        const mongoDB = new MongoLib();
        const user = await mongoDB.findOne('users', {
            _id: ObjectID(payload._id),
        });

        if (!user) {
            return res.send({ ok: false, token: '' });
        }

        let userTokenVersion = !user.tk_version ? 0 : user.tk_version;
        if (userTokenVersion !== payload.tk_version) {
            return res.send({ ok: false, token: '' });
        }

        //refresh and set a new refresh token
        sendRefreshToken(res, createRefreshToken(user));

        //send back an access token
        return res.send({
            ok: true,
            token: createAccessToken(user),
        });
    });
};

module.exports = refreshToken;
