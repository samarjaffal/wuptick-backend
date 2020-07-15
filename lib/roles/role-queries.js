'use strict';
const MongoLib = require('../db/mongo');

const collection = 'roles';
const mongoDB = new MongoLib();

module.exports = {
    getRoles: async () => {
        let roles;
        try {
            const query = {};
            roles = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return roles || [];
    },
};
