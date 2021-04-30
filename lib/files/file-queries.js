'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'files';
const mongoDB = new MongoLib();
const File = require('../../helpers/file');

module.exports = {
    getFiles: async (root, { id }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await File.getFiles(id);
    },
};
