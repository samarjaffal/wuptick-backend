'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    Topic: {
        owner: async ({ owner }) => {
            let userData;
            try {
                if (!owner) return null;
                userData = await mongoDB.get('users', owner);
            } catch (error) {
                console.error(error);
            }
            return userData;
        },

        collaborators: async ({ collaborators }) => {
            let usersData, ids;

            try {
                ids = collaborators ? collaborators : [];
                usersData = await mongoHelper.getAllDocuments('users', ids);
            } catch (error) {
                console.error(error);
            }

            return usersData;
        },

        tag: async ({ tag }) => {
            let data;
            try {
                if (!tag) return null;
                if ('_id' in tag) {
                    tag = ObjectID(tag._id);
                }
                data = await mongoDB.get('tags', tag);
            } catch (error) {
                console.error(error);
            }
            return data;
        },

        module: async ({ module }) => {
            let data;
            try {
                if (!module) return null;
                if ('_id' in module) {
                    module = ObjectID(module._id);
                }
                data = await mongoDB.get('modules', module);
            } catch (error) {
                console.error(error);
            }
            return data;
        },
    },
};
