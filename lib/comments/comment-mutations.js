'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');
const collection = 'comments';
const mongoDB = new MongoLib();
const Comment = require('../../helpers/comment');

module.exports = {
    createComment: async (root, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Comment.createComment(input);
    },

    editComment: async (root, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Comment.editComment(input);
    },

    deleteComment: async (root, { commentId, taskId, topicId }) => {
        let comment, query;

        try {
            const operator = { comments: { _id: ObjectID(commentId) } };

            if (taskId !== null) {
                query = {
                    task: ObjectID(taskId),
                    'comments._id': ObjectID(commentId),
                };
            } else if (topicId !== null) {
                query = {
                    topic: ObjectID(topicId),
                    'comments._id': ObjectID(commentId),
                };
            }

            [comment] = await mongoDB.getAll(collection, query);
            if (!comment) throw new Error(`The comment doesn't exist`);

            await mongoDB.removeFromSet(collection, comment._id, operator);
        } catch (error) {
            console.error(error);
        }

        return comment;
    },
};
