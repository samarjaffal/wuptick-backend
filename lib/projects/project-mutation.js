'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

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
        input.owner = ObjectID(input.owner._id);
        input.team_owner = ObjectID(input.team_owner._id);
        let project = await crudHelper.create(collection, input, defaults);
        return project;
    },

    editProject: async (root, { projectId, input }) => {
        let project;
        try {
            let inputData = { ...input };
            if ('tag' in inputData) {
                inputData.tag = ObjectID(inputData.tag._id);
            }
            project = await crudHelper.edit(
                collection,
                projectId,
                inputData,
                'project'
            );
        } catch (error) {
            console.error(error);
        }
        return project;
    },

    deleteProject: async (root, { projectId }) => {
        let project;
        project = await crudHelper.delete(collection, projectId, 'project');
        return project;
    },

    addMember: async (root, { projectId, userId, roleId, teamId }) => {
        let project;
        const operator = {
            format: {
                members: {
                    user: ObjectID(userId),
                    role: ObjectID(roleId),
                    team: ObjectID(teamId),
                },
            },
            key: 'members',
            set: 'members',
        };

        project = await crudHelper.addSet(
            collection,
            projectId,
            operator,
            'project'
        );
        return project;
    },

    removeMember: async (root, { projectId, userId }) => {
        let project;

        const operator = { members: { user: ObjectID(userId) } };

        project = await crudHelper.removeSet(
            collection,
            projectId,
            'project',
            operator
        );

        return project;
    },
};
