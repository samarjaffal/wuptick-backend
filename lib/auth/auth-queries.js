'use strict';
const bcrypt = require('bcrypt');
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const {
    createAccessToken,
    createRefreshToken,
    sendRefreshToken,
} = require('../../shared/tokens');
const collection = 'users';
const mongoDB = new MongoLib();

module.exports = {
    login: async (_, { email, password }, context) => {
        const user = await mongoDB.findOne(collection, { email });
        if (!user) {
            return {
                __typename: 'AuthUserError',
                message: 'The given user or password is incorrect.',
            };
        }

        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            return {
                __typename: 'AuthUserError',
                message: 'The given user or password is incorrect.',
            };
        }

        if (!user.confirmed) {
            return {
                __typename: 'AuthUserNotConfirmedError',
                message: 'Please confirm your email to login.',
            };
        }

        //login successful

        //updater user attempts

        let newAttempt = user.user_attempts + 1;
        try {
            await mongoDB.updateOne(
                collection,
                { _id: user._id },
                { user_attempts: newAttempt }
            );
        } catch (error) {
            return {
                __typename: 'AuthUserError',
                message: 'Something went wrong. Please try to login again!',
            };
        }

        //create a refresh Token
        //add refresh token to a cookie
        sendRefreshToken(context.res, createRefreshToken(user));

        //create an access token
        const token = createAccessToken(user);

        return {
            __typename: 'AuthData',
            _id: user._id,
            token,
            tokenExpiration: 1,
            userAttempts: newAttempt,
        };
    },
};
