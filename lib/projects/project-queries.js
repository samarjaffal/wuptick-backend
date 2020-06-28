'use strict';
const MongoLib = require('../db/mongo');

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
};
