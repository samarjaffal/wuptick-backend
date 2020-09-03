'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const collection = 'users';
const mongoDB = new MongoLib();
const { generateLastActivity } = require('../../functions/feed');

const defaults = {
    last_name: '',
    occupation: '',
    birthday: null,
    avatar: '',
    status: 'active',
    level: 'user',
    tk_version: 0,
};

module.exports = {
    editUser: async (root, { userId, input }) => {
        let user;
        user = await crudHelper.edit(collection, userId, input, 'user');
        return user;
    },

    deleteUser: async (root, { userId }) => {
        let user;
        user = await crudHelper.delete(collection, userId, 'user');
        return user;
    },

    addTeam: async (root, { userId, teamId }) => {
        let user;
        const operator = {
            format: {
                teams: ObjectID(teamId),
            },
            key: 'teams',
            set: 'teams',
        };

        user = await crudHelper.addSet(collection, userId, operator, 'user');
        return user;
    },

    removeTeam: async (root, { userId, teamId }) => {
        let user;
        const operator = { teams: ObjectID(teamId) };
        user = await crudHelper.removeSet(collection, userId, 'user', operator);
        return user;
    },

    addFavoriteProject: async (root, { userId, projectId }) => {
        let user;
        const operator = {
            format: {
                favorite_projects: ObjectID(projectId),
            },
            key: 'favorite_projects',
            set: 'favorite_projects',
        };

        user = await crudHelper.addSet(collection, userId, operator, 'user');
        return user;
    },

    removeFavoriteProject: async (root, { userId, projectId }) => {
        let user;
        const operator = {
            format: { favorite_projects: ObjectID(projectId) },
            key: 'favorite_projects',
            set: 'favorite_projects',
        };
        user = await crudHelper.removeSet(collection, userId, 'user', operator);
        return user;
    },

    addFavoriteTask: async (root, { userId, taskId }) => {
        let user;
        const operator = {
            format: { favorite_tasks: ObjectID(taskId) },
            key: 'favorite_tasks',
            set: 'favorite_tasks',
        };
        user = await crudHelper.addSet(collection, userId, operator, 'user');
        return user;
    },

    removeFavoriteTask: async (root, { userId, taskId }) => {
        let user;
        const operator = { favorite_tasks: ObjectID(taskId) };
        user = await crudHelper.removeSet(collection, userId, 'user', operator);
        return user;
    },

    revokeRFTokensForUser: async (root, { userId }) => {
        const query = { _id: ObjectID(userId) };
        const data = { $inc: { tk_version: 1 } };
        try {
            await mongoDB.updateSet(collection, query, data);
        } catch (error) {
            console.log(error);
            throw error;
        }
        return true;
    },

    generateLastActivity: async (_, { teamId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return generateLastActivity(teamId);
    },
};
