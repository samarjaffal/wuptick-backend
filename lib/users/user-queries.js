'use strict';
const MongoLib = require('../db/mongo');

const collection = 'users';
const mongoDB = new MongoLib();

module.exports = {
    me: async (_, {}, context) => {
        let user, id;
        if (!context.isAuth) {
            return null;
        }
        try {
            id = context.req._id;
            user = await mongoDB.get(collection, id);
            return user || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getUsers: async () => {
        try {
            const query = {};
            const users = await mongoDB.getAll(collection, query);
            return users || [];
        } catch (error) {
            console.error(error);
        }
    },

    testUser: (root, args, context) => {
        if (!context.isAuth) {
            throw new Error(`Unauthenticated!`);
        }
        return true;
    },
};
