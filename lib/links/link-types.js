'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    Link: {
        owner: async ({ owner }) => {
            let userData;
            try {
                if (!owner) return null;
                if ('_id' in owner) owner = ObjectID(owner._id);
                userData = await mongoDB.get('users', owner);
            } catch (error) {
                console.error(error);
            }
            return userData || {};
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
            return data || {};
        },
    },
};
