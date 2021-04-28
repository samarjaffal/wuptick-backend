'use strict';
const MongoLib = require('../db/mongo');
const mongoDB = new MongoLib();
const collection = 'files';
const crudHelper = require('../../helpers/crud-helper');
const File = require('../../helpers/file');
const { ObjectID } = require('mongodb');

const defaults = {
    description: '',
    module: null,
    task: null,
};

module.exports = {
    createFile: async (root, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await File.createFile(input);
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
