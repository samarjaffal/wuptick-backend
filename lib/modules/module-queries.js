'use strict';
const MongoLib = require('../db/mongo');

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
};
