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
    addCollaborator: async (root, { taskId, userId }) => {
        let task;
        const operator = {
            format: {
                collaborators: ObjectID(userId),
            },
            key: 'collaborators',
            set: 'collaborators',
        };
        task = await crudHelper.addSet(collection, taskId, operator, 'task');
        return task;
    },
    removeCollaborator: async (root, { taskId, userId }) => {
        let task;
        const operator = { collaborators: ObjectID(userId) };
        task = await crudHelper.removeSet(collection, taskId, 'task', operator);
        return task;
    },

    assignTask: async (_, { taskId, userId }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Task.assignTask(taskId, userId);
    },

    addDeadlineToTask: async (_, { taskId, date }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Task.addDeadlineToTask(taskId, date);
    },
};
