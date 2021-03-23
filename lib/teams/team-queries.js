'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'teams';
const mongoDB = new MongoLib();
const { userLoader, teamLoader } = require('../db/dataLoaders');

module.exports = {
    getTeams: async (_, {}, context) => {
        let teams;
        if (!context.isAuth) {
            return null;
        }
        try {
            let id = context.req._id;
            let user = await userLoader.load(ObjectID(id));
            teams = await teamLoader.loadMany(user.teams);
        } catch (error) {
            console.error(error);
        }

        return teams || [];
    },
};
