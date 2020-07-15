'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    Tag: {
        team: async ({ team }) => {
            let data;
            try {
                if (!team) return null;
                if ('_id' in team) team = ObjectID(team._id);
                data = await mongoDB.get('teams', team);
            } catch (error) {
                console.error(error);
            }
            return data || {};
        },
    },
};
