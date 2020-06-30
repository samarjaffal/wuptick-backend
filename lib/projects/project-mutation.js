'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const collection = 'projects';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    image: '',
    color: '',
    privacy: 'team',
    status: 'active',
    members: [],
    tag: null,
};

module.exports = {
    createProject: async (root, { input }) => {
        let projectId;

        input.owner = ObjectID(input.owner._id);
        input.team_owner = ObjectID(input.team_owner._id);

        const newProject = { ...defaults, ...input };
        try {
            projectId = await mongoDB.create(collection, newProject);
            newProject._id = projectId;
        } catch (error) {
            console.error(error);
        }
        return newProject;
    },

    editProject: async (root, { projectId, input }) => {
        let project;
        try {
            project = await mongoDB.get(collection, projectId);
            if (!project) throw new Error("The project doesn't exist");
            let inputData = { ...input };
            if ('tag' in inputData) {
                inputData.tag = ObjectID(inputData.tag._id);
            }
            await mongoDB.update(collection, projectId, inputData);
            project = { ...project, ...input };
        } catch (error) {
            console.error(error);
        }
        return project;
    },

    addMembers: async (root, { projectId, userId, roleId, teamId }) => {
        let project;
        try {
            project = await mongoDB.get('projects', projectId);

            if (!project) throw new Error("The project doesn't exist");

            const operator = {
                members: {
                    user: ObjectID(userId),
                    role: ObjectID(roleId),
                    team: ObjectID(teamId),
                },
            };
            await mongoDB.addToSet(collection, projectId, operator);
            project = { ...project, members: [{ ...operator.members }] };
        } catch (error) {
            console.error(error);
        }
        return project;
    },
};
