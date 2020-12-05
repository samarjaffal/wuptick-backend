'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const Team = require('../../helpers/team-helper');
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

        return await Team.editTeam(teamId, input);
    },

    addProject: async (root, { teamId, projectId }) => {
        /*   let team;
        const operator = {
            format: {
                projects: ObjectID(projectId),
            },
            key: 'projects',
            set: 'projects',
        };
        team = await crudHelper.addSet(collection, teamId, operator, 'team');
        return team; */
        return await Team.addProject(teamId, projectId);
    },

    deleteTeam: async (_, { teamId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Team.deleteTeam(teamId);
    },

    removeProject: async (_, { teamId, projectId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Team.removeProject(teamId, projectId);
    },

    removeMemberFromTeam: async (_, { teamId, userId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Team.removeMemberFromTeam(teamId, userId);
    },
};
