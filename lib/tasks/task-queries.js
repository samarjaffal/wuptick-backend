'use strict';
const MongoLib = require('../db/mongo');

const collection = 'tasks';
const mongoDB = new MongoLib();

module.exports = {
    getTasks: async () => {
        let tasks;
        try {
            const query = {};
            tasks = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return tasks || [];
    },
};
