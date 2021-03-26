'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const Task = require('../../helpers/task');
const collection = 'tasks';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    deadline: '',
    assigned: null,
    tag: null,
    estimated_time: '',
    priority: false,
    url: '',
    done: false,
    collaborators: [],
};

module.exports = {
    createTask: async (root, { input, moduleId, listId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        const userId = context.req._id;
        return await Task.createTask(input, moduleId, listId, userId);
    },

    editTask: async (root, { taskId, input, url }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Task.editTask(taskId, input, url);
    },

    deleteTask: async (_, { taskId, listId, moduleId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Task.deleteTask(taskId, listId, moduleId);
    },
    addCollaborator: async (root, { taskId, userId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Task.addCollaborator(taskId, userId);
    },
    removeCollaborator: async (root, { taskId, userId }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Task.removeCollaborator(taskId, userId);
    },

    assignTask: async (_, { taskId, userId, url }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Task.assignTask(taskId, userId, url);
    },

    addDeadlineToTask: async (_, { taskId, date }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Task.addDeadlineToTask(taskId, date);
    },
};
