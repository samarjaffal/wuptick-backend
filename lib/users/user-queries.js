'use strict';
const MongoLib = require('../db/mongo');

const collection = 'users';
const mongoDB = new MongoLib();

module.exports = {
    getUsers: async () => {
        try {
            const query = {};
            const users = await mongoDB.getAll(collection, query);
            return users || [];
        } catch (error) {
            console.error(error);
        }
    },
};
