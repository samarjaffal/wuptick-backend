'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'projects';
const mongoDB = new MongoLib();

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
            const query = { _id: ObjectID(projectId) };
            project = await mongoDB.findOne(collection, query);
        } catch (error) {
            console.error(error);
        }

        return project || {};
    },
};
