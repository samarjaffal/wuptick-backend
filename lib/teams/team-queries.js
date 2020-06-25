'use strict';
const MongoLib = require('../db/mongo');

const collection = 'teams';
const mongoDB = new MongoLib();

module.exports = {
    getTeams: async () => {
        let teams;
        try {
            const query = {};
            teams = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return teams || [];
    },
};
