'use strict';
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const { notificationLoader } = require('../lib/db/dataLoaders');
const collection = 'files';
const mongoDB = new MongoLib();
const crudHelper = require('./crud-helper');
const mongoHelper = require('./mongo-helper');

const defaults = {
    description: '',
    parentId: null,
    fileUrl: '',
    parentUrl: '',
    created_at: '',
};

module.exports = {
    createFile: async (input) => {
        let file;
        if ('owner' in input) input.owner = ObjectID(input.owner._id);
        if ('parentId' in input) input.parentId = ObjectID(input.parentId);
        /*  if ('module' in input) input.module = ObjectID(input.module._id);
        if ('task' in input) input.task = ObjectID(input.task._id); */
        input.created_at = new Date();
        file = await crudHelper.create(collection, input, defaults);
        return file;
    },

    getFiles: async (id) => {
        let files;
        try {
            const query = {
                parentId: ObjectID(id),
            };
            files = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return files || [];
    },
};
