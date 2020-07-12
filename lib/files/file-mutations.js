'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'files';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    module: null,
    task: null,
};

module.exports = {
    createFile: async (root, { input }) => {
        let file;
        if ('owner' in input) input.owner = ObjectID(input.owner._id);
        if ('module' in input) input.module = ObjectID(input.module._id);
        if ('task' in input) input.task = ObjectID(input.task._id);
        file = await crudHelper.create(collection, input, defaults);
        return file;
    },

    editFile: async (root, { fileId, input }) => {
        let file;
        try {
            let inputData = { ...input };
            file = await crudHelper.edit(collection, fileId, inputData, 'file');
        } catch (error) {
            console.error(error);
        }
        return file;
    },

    deleteFile: async (root, { fileId }) => {
        let file;
        file = await crudHelper.delete(collection, fileId, 'file');
        return file;
    },
};
