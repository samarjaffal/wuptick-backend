'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'files';
const mongoDB = new MongoLib();

module.exports = {
    getFiles: async (root, { moduleId }) => {
        let files;
        try {
            const query = {
                module: ObjectID(moduleId),
            };
            files = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return files || [];
    },

    getFilesForTask: async (root, { moduleId, taskId }) => {
        let files;
        try {
            const query = {
                module: ObjectID(moduleId),
                task: ObjectID(taskId),
            };
            files = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return files || [];
    },
};
