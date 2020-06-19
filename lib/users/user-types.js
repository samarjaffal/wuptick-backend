'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');

const mongoDB = new MongoLib();

module.exports = {
    User: {
        teams: async ({ teams }) => {
            let teamsData, ids;

            try {
                ids = teams ? teams.map((id) => ObjectID(id)) : [];
                teamsData =
                    ids.length > 0
                        ? await mongoDB.getAll('teams', { _id: { $in: ids } })
                        : [];
            } catch (error) {
                console.error(error);
            }

            return teamsData;
        },
    },

    Team: {
        owner: async ({ owner }) => {
            let userData;
            try {
                if (!owner) return null;
                userData = await mongoDB.get('users', owner);
            } catch (error) {
                console.error(error);
            }
            return userData;
        },
    },
};
