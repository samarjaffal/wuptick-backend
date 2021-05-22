'use strict';
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('./crud-helper');
const collection = 'gd_user_folders';
const mongoDB = new MongoLib();

const defualts = {
    user: '',
    folders: {},
};

module.exports = {
    initUserFolder: async (userId) => {
        try {
            const input = { user: ObjectID(userId) };
            const id = await crudHelper.create(collection, input, defualts);
            console.log(id, 'id');
            return id || null;
        } catch (error) {
            console.error(error);
        }
    },

    saveFolderForUser: async (userId, folder, folderId) => {
        try {
            let query = {
                user: ObjectID(userId),
            };
            const string = `folders.$.${folder}`;
            let operator = {
                $set: { [`folders.${folder}`]: folderId },
            };
            await mongoDB.findOneAndUpdate(collection, query, operator);
            return true;
        } catch (error) {
            console.error(error);
        }
    },

    getUserFolders: async (userId) => {
        console.log(userId, 'userId');
        try {
            let query = {
                user: ObjectID(userId),
            };
            const folders = await mongoDB.findOne(collection, query);
            return folders || null;
        } catch (error) {
            console.error(error);
        }
    },
};
