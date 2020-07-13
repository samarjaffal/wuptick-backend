'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'comments';
const mongoDB = new MongoLib();

module.exports = {
    getCommentsForTask: async (root, { taskId }) => {
        let comments;
        try {
            const query = {
                task: ObjectID(taskId),
            };
            comments = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return comments || [];
    },

    getCommentsForTopic: async (root, { topicId }) => {
        let comments;
        try {
            const query = {
                topic: ObjectID(topicId),
            };
            comments = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }
        return comments || [];
    },
};
