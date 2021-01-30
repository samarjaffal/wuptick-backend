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

    deleteComment: async (root, { commentId, taskId, topicId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Comment.deleteComment(commentId, taskId, topicId);
    },
};
