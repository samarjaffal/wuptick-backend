const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const mongoHelper = require('./mongo-helper');
const crudHelper = require('./crud-helper');
const { ObjectID } = require('mongodb');

const collection = 'modules';

const defaults = {
    description: '',
    status: 'active',
    task_lists: [],
    modules_order: [],
};

module.exports = {
    createModule: async (input) => {
        input.project = ObjectID(input.project._id);
        let module = await crudHelper.create(collection, input, defaults);
        return module;
    },

    editModule: async (moduleId, input) => {
        let module;
        module = await crudHelper.edit(collection, moduleId, input, 'module');
        return module;
    },

    getModule: async (moduleId) => {
        let module;
        try {
            module = await mongoDB.get(collection, moduleId);
        } catch (error) {
            console.error(error);
        }
        return module || {};
    },

    saveTaskListsOrder: async (moduleId, taskLists) => {
        try {
            let data = { task_lists: taskLists };

            await mongoDB.update(collection, moduleId, data);
        } catch (error) {
            console.error(error);
            return false;
        }
        return true;
    },
};
