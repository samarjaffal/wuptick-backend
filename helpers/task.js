const MongoLib = require('../lib/db/mongo');
const Module = require('./module-helper');
const mongoDB = new MongoLib();
const crudHelper = require('./crud-helper');
const collection = 'tasks';
const { ObjectID } = require('mongodb');

const defaults = {
    description: '',
    descriptionJson: '',
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
    createTask: async (input, moduleId, listId, userId) => {
        let task;
        input.owner = ObjectID(userId);
        /* if ('assigned' in input) input.assigned = ObjectID(input.assigned._id);
        if ('tag' in input) input.tag = ObjectID(input.tag._id); */
        input.created_at = new Date();
        task = await crudHelper.create(collection, input, defaults);
        await Module.addTask(moduleId, listId, String(task._id));
        return task._id;
    },

    editTask: async (taskId, input) => {
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

    getTasks: async (moduleId) => {
        let tasks;
        try {
            const query = { module: ObjectID(moduleId) };
            tasks = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return tasks || [];
    },

    assignTask: async (taskId, userId) => {
        const assigned = userId !== null ? ObjectID(userId) : null;

        try {
            await mongoDB.update(collection, taskId, {
                assigned: assigned,
            });
            return userId;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    addDeadlineToTask: async (taskId, date) => {
        let newDate = date !== null ? new Date(date).toISOString() : null;
        try {
            await mongoDB.update(collection, taskId, {
                deadline: newDate,
            });
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }

        return true;
    },

    deleteTask: async (taskId, listId, moduleId) => {
        await Module.removeTaskFromList(moduleId, listId, taskId);
        await crudHelper.delete(collection, taskId, 'task');
        return true;
    },
};
