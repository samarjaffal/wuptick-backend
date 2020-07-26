'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { config } = require('../../config/index');
const MongoLib = require('../db/mongo');
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} = require('../../shared/tokens');
const collection = 'users';
const mongoDB = new MongoLib();

module.exports = {
    login: async (root, { email, password }, context) => {
        const user = await mongoDB.findOne(collection, { email });
        if (!user) throw new Error('User does not exist!');

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) throw new Error(`Password is incorrect!`);

        //login successful

        //create a refresh Token
        //add refresh token to a cookie
        sendRefreshToken(context.res, createRefreshToken({ _id: user._id }));

        //create an access token
        const secret = config.secret;
        const token = createAccessToken({ _id: user._id, email: user.email });

        console.log(cookie, 'cookie');
        return { _id: user._id, token, tokenExpiration: 1 };
    },
};
