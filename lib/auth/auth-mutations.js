'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

const crudHelper = require('../../helpers/crud-helper');
const collection = 'users';
const mongoDB = new MongoLib();

module.exports = {
    register: async (root, { input }) => {
        let user, ifExist;

        ifExist = await mongoDB.getAll(
            collection,
            { email: input.email },
            true
        );

        if (ifExist) throw new Error('User exists already.');

        return bcrypt
            .hash(input.password, 12)
            .then(async (hashedPassword) => {
                input.password = hashedPassword;
                user = await crudHelper.create(collection, input);
                return { ...user, password: null };
            })
            .catch((error) => {
                throw error;
            });
    },
};
