'use strict';
const MongoLib = require('../db/mongo');
const collection = 'topics';
const mongoDB = new MongoLib();
const { ObjectID } = require('mongodb');
const { getIdsFromArray } = require('../../helpers/mongo-helper');

module.exports = {
    getTopics: async () => {
        let topics;
        try {
            const query = {};
            topics = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return topics || [];
    },

    getProjectTopics: async (_, { projectId }, context) => {
        let modules, topics;
        let moduleIds;
        if (!context.isAuth) {
            return null;
        }
        try {
            const modulesQuery = { project: ObjectID(projectId) };
            modules = await mongoDB.getAll('modules', modulesQuery);
            moduleIds = await getIdsFromArray(modules);

            const topicsQuery = { module: { $in: moduleIds } };

            topics = await mongoDB.getAll(collection, topicsQuery);
        } catch (error) {
            console.error(error);
        }

        return topics || [];
    },
};
