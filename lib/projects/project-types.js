'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    Project: {
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

        team_owner: async ({ team_owner }) => {
            let team;
            try {
                if (!team_owner) return null;
                team = await mongoDB.get('teams', team_owner);
            } catch (error) {
                console.error(error);
            }
            return team;
        },

        tag: async ({ tag }) => {
            let data;
            try {
                if (!tag) return null;
                data = await mongoDB.get('tags', tag);
            } catch (error) {
                console.error(error);
            }
            return data;
        },
    },
};
