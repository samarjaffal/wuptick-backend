'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoDB = new MongoLib();
const { getCommentsForTask } = require('../../helpers/comment');

module.exports = {
    getCommentsForTask: async (root, { taskId }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await getCommentsForTask(taskId);
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
