'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const collection = 'teams';
const mongoDB = new MongoLib();

const defaults = {
    owner: null,
    projects: [],
    members: [],
};

module.exports = {
    createTeam: async (root, { input }, context) => {
        if (!context.isAuth) {
            throw new Error(`Unauthenticated!`);
        }
        let team;
        input.owner = ObjectID(input.owner._id);
        team = await crudHelper.create(collection, input, defaults);
        return team;
    },

    editTeam: async (root, { teamId, input }, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        let team;
        team = await crudHelper.edit(collection, teamId, input, 'team');
        return team;
    },

    addProject: async (root, { teamId, projectId }) => {
        let team;
        const operator = {
            format: {
                projects: ObjectID(projectId),
            },
            key: 'projects',
            set: 'projects',
        };
        team = await crudHelper.addSet(collection, teamId, operator, 'team');
        return team;
    },

    deleteTeam: async (root, { teamId }) => {
        let team;
        team = await crudHelper.delete(collection, teamId, 'team');
        return team;
    },

    removeProject: async (root, { teamId, projectId }) => {
        let team;
        const operator = { projects: ObjectID(projectId) };
        team = await crudHelper.removeSet(collection, teamId, 'team', operator);
        return team;
    },
};
