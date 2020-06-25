'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const collection = 'teams';
const mongoDB = new MongoLib();

const defaults = {
    owner: null,
    projects: [],
};

module.exports = {
    createTeam: async (root, { input }) => {
        let teamId;
        const newTeam = { ...defaults, ...input };
        try {
            teamId = await mongoDB.create(collection, newTeam);
            newTeam._id = teamId;
        } catch (error) {
            console.error(error);
        }
        return newTeam;
    },
};
