'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'projects';
const mongoDB = new MongoLib();
const { projectLoader } = require('../db/dataLoaders');

module.exports = {
    getProjects: async () => {
        let projects;
        try {
            const query = {};
            projects = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return projects || [];
    },

    getProject: async (_, { projectId }, context) => {
        let project;
        if (!context.isAuth) {
            return null;
        }
        try {
            /*   const query = { _id: ObjectID(projectId) }; */
            project = await projectLoader.load(ObjectID(projectId));
        } catch (error) {
            console.error(error);
        }

        return project || {};
    },
};
