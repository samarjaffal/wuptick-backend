'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const collection = 'users';
const mongoDB = new MongoLib();

const defaults = {
    last_name: '',
    occupation: '',
    birthday: null,
    avatar: '',
    status: 'active',
    level: 'user',
};

module.exports = {
    createUser: async (root, { input }) => {
        let user;
        user = await crudHelper.create(collection, input, defaults);
        return user;
    },

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
};
