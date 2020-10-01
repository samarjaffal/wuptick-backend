'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

const crudHelper = require('../../helpers/crud-helper');
const { sendRefreshToken } = require('../../shared/tokens');
const { userLoader } = require('../db/dataLoaders');

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

    changePassword: async (_, { oldPassword, newPassword }, context) => {
        let user;
        if (!context.isAuth) {
            return {
                __typename: 'ChangePassword',
                _id: context._id,
                password: false,
            };
        }

        user = await userLoader.load(ObjectID(context._id));

        if (!user) {
            return {
                __typename: 'AuthUserError',
                message: 'User not found!',
            };
        }

        const isEqual = await bcrypt.compare(oldPassword, user.password);

        if (!isEqual) {
            return {
                __typename: 'OldPasswordError',
                message: 'The old password you provided is not correct!',
            };
        }

        return bcrypt
            .hash(newPassword, 12)
            .then(async (hashedPassword) => {
                newPassword = hashedPassword;
                await mongoDB.update('users', user._id, {
                    password: hashedPassword,
                });
                return {
                    __typename: 'ChangePassword',
                    _id: user._id,
                    password: true,
                };
            })
            .catch((error) => {
                throw error;
            });
    },
};
