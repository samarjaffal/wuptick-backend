'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');
const collection = 'users';
const mongoDB = new MongoLib();
const { generateLastActivity } = require('../../functions/feed');
const { userLoader } = require('../db/dataLoaders');

module.exports = {
    me: async (_, {}, context) => {
        let user, id;
        if (!context.isAuth) {
            return null;
        }
        try {
            id = context.req._id;
            /* user = await mongoDB.get(collection, id); */
            user = await userLoader.load(ObjectID(id));
            return user || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getUser: async (_, { userId }, context) => {
        let user;
        if (!context.isAuth) {
            return null;
        }
        try {
            /* user = await mongoDB.get(collection, userId); */
            user = await userLoader.load(ObjectID(userId));
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

    getLastActivity: async (_, { teamId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return generateLastActivity(teamId);
    },
};
