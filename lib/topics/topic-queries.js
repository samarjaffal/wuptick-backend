'use strict';
const MongoLib = require('../db/mongo');

const collection = 'topics';
const mongoDB = new MongoLib();

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
};
