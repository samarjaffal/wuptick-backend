'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

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
    createTask: async (root, { input }) => {
        let task;
        input.owner = ObjectID(input.owner._id);
        if ('assigned' in input) input.assigned = ObjectID(input.assigned._id);
        if ('tag' in input) input.tag = ObjectID(input.tag._id);
        task = await crudHelper.create(collection, input, defaults);
        return task;
    },
    editTask: async (root, { taskId, input }) => {
        let task;
        try {
            let inputData = { ...input };
            if ('tag' in inputData) inputData.tag = ObjectID(inputData.tag._id);
            if ('assigned' in inputData)
                inputData.assigned = ObjectID(input.assigned._id);
            task = await crudHelper.edit(collection, taskId, inputData, 'task');
        } catch (error) {
            console.error(error);
        }
        return task;
    },
    deleteTask: async (root, { taskId }) => {
        let task;
        task = await crudHelper.delete(collection, taskId, 'task');
        return task;
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
};
