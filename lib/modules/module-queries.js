'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'modules';
const mongoDB = new MongoLib();

module.exports = {
    getModules: async () => {
        let modules;
        try {
            const query = {};
            modules = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return modules || [];
    },

    getProjectModules: async (_, { projectId }, context) => {
        let modules;
        if (!context.isAuth) {
            return null;
        }
        try {
            const query = { project: ObjectID(projectId) };
            modules = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return modules || [];
    },
};
