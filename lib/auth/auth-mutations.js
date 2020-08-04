'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

const crudHelper = require('../../helpers/crud-helper');
const { sendRefreshToken } = require('../../shared/tokens');
const collection = 'users';
const mongoDB = new MongoLib();

module.exports = {
    register: async (_, { input }) => {
        let user, ifExist;

        ifExist = await mongoDB.getAll(
            collection,
            { email: input.email },
            true
        );

        if (ifExist) {
            return {
                __typename: 'AuthUserExistError',
                message: 'User exists already.',
            };
        }

        return bcrypt
            .hash(input.password, 12)
            .then(async (hashedPassword) => {
                input.password = hashedPassword;
                user = await crudHelper.create(collection, input);
                return {
                    __typename: 'User',
                    ...user,
                    password: null,
                };
            })
            .catch((error) => {
                throw error;
            });
    },

    logout: (_, {}, context) => {
        //create and send an empty refresh Token
        sendRefreshToken(context.res, '');
        return true;
    },
};
