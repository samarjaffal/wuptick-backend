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
        input.owner = ObjectID(input.owner._id);
        const newTeam = { ...defaults, ...input };
        try {
            teamId = await mongoDB.create(collection, newTeam);
            newTeam._id = teamId;
        } catch (error) {
            console.error(error);
        }
        return newTeam;
    },

    editTeam: async (root, { teamId, input }) => {
        let team;
        try {
            team = await mongoDB.get(collection, teamId);
            if (!team) throw new Error("The team doesn't exist");
            await mongoDB.update(collection, teamId, input);
            team = { ...team, ...input };
        } catch (error) {
            console.error(error);
        }
        return team;
    },

    addProject: async (root, { teamId, projectId }) => {
        let team, project;
        try {
            team = await mongoDB.get(collection, teamId);
            project = await mongoDB.get('projects', projectId);

            if (!team) throw new Error("The team doesn't exist");
            if (!project) throw new Error("The project doesn't exist");

            const operator = { projects: ObjectID(projectId) };
            await mongoDB.addToSet(collection, teamId, operator);

            team = { ...team, projects: [{ ...operator.projects }] };
        } catch (error) {
            console.error(error);
        }
        return team;
    },

    deleteTeam: async (root, { teamId }) => {
        let team, deletedTeam;

        try {
            team = await mongoDB.get(collection, teamId);
            if (!team) throw new Error("The team doesn't exist");
            await mongoDB.delete(collection, teamId);
            deletedTeam = { ...team };
        } catch (error) {
            console.error(error);
        }
        return deletedTeam;
    },

    removeProject: async (root, { teamId, projectId }) => {
        let team, project;

        try {
            team = await mongoDB.get(collection, teamId);
            if (!team) throw new Error("The team doesn't exist");

            project = await mongoDB.get('projects', projectId);
            if (!project) throw new Error("The project doesn't exist");

            const operator = { projects: ObjectID(projectId) };
            await mongoDB.removeFromSet(collection, teamId, operator);
        } catch (error) {
            console.error(error);
        }

        return team;
    },
};
