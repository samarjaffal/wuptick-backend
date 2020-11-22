'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const Project = require('../../helpers/project-helper');

const collection = 'projects';
const mongoDB = new MongoLib();

module.exports = {
    createProject: async (_, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Project.createProject(input);
    },

    editProject: async (_, { projectId, input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Project.editProject(projectId, input);
    },

    deleteProject: async (_, { projectId, teamId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Project.deleteProject(projectId, teamId);
    },

    addMember: async (_, { projectId, userId, roleId, teamId }) => {
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

    removeMember: async (_, { projectId, userId }, context) => {
        let project;

        if (!context.isAuth) {
            return null;
        }
        const operator = { members: { user: ObjectID(userId) } };

        project = await crudHelper.removeSet(
            collection,
            projectId,
            'project',
            operator
        );

        return project;
    },

    updateMemberRole: async (_, { projectId, userId, roleId }, context) => {
        let role;
        if (!context.isAuth) {
            return null;
        }
        try {
            const query = {
                _id: ObjectID(projectId),
                'members.user': ObjectID(userId),
            };
            const data = { $set: { 'members.$.role': ObjectID(roleId) } };
            await mongoDB.updateSet(collection, query, data);
            role = mongoDB.get('roles', roleId);
        } catch (error) {
            console.log(error);
            throw new Error(error, 'error');
        }

        return role;
    },
};
