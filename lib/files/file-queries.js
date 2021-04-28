'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'files';
const mongoDB = new MongoLib();
const File = require('../../helpers/file');

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

    getFilesForTask: async (root, { taskId }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await File.getFilesForTask(taskId);
    },
};
