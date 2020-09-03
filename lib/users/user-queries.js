'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');
const collection = 'users';
const mongoDB = new MongoLib();
const { generateLastActivity } = require('../../functions/feed');

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

    getLastActivity: async (_, { teamId, _date }, context) => {
        if (!context.isAuth) {
            return null;
        }
        /*   return generateLastActivity(teamId); */
        const date = new Date(_date);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        console.log(date, month, year, _date, 'dateeeeee');

        let activity = await mongoDB.findOne('activity', {
            team: ObjectID(teamId),
            month,
            year,
        });

        console.log(activity, 'activity');
        return activity;
    },
};
