'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const collection = 'users';
const mongoDB = new MongoLib();
const User = require('../../helpers/user-helper');
const { generateLastActivity } = require('../../functions/feed');

module.exports = {
    editUser: async (root, { userId, input }, context) => {
        let user;
        if (!context.isAuth) {
            return null;
        }
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

    toggleFavTask: async (root, { state, taskId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        const userId = context.req._id;
        return await User.toggleFavTask(state, userId, taskId);
    },

    updateAvatar: async (root, { imgStr, fileName }, context) => {
        if (!context.isAuth) {
            return null;
        }
        const userId = context.req._id;
        if (!userId) return false;
        return await User.updateAvatar(imgStr, fileName, userId);
    },
};
