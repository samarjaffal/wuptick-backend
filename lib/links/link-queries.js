'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'links';
const mongoDB = new MongoLib();

module.exports = {
    getLinks: async (root, { moduleId }) => {
        let links;
        try {
            const query = {
                module: ObjectID(moduleId),
            };
            links = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return links || [];
    },
};
