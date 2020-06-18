'use strict';
const MongoLib = require('../db/mongo');

const collection = 'users';
const mongoDB = new MongoLib();

const defaults = {
    last_name: '',
    occupation: '',
    birthday: null,
    avatar: '',
};

module.exports = {
    createUser: async (root, { input }) => {
        let userId;
        const newUser = { ...defaults, ...input };
        try {
            userId = await mongoDB.create(collection, newUser);
            newUser._id = userId;
        } catch (error) {
            console.error(error);
        }
        return newUser;
    },
};
