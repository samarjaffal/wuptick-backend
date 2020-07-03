'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'modules';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    status: 'active',
    task_lists: [],
};

module.exports = {
    createModule: async (root, { input }) => {
        input.project = ObjectID(input.project._id);
        let module = await crudHelper.create(collection, input, defaults);
        return module;
    },

    editModule: async (root, { moduleId, input }) => {
        let module;
        module = await crudHelper.edit(collection, moduleId, input, 'module');
        return module;
    },

    deleteModule: async (root, { moduleId }) => {
        let module;
        module = await crudHelper.delete(collection, moduleId, 'module');
        return module;
    },
};
