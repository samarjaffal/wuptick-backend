'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'comments';
const mongoDB = new MongoLib();
const maximumComments = 6;

const defaults = {
    page: 1,
    count: 1,
    comments: [],
};

module.exports = {
    createComment: async (root, { input }) => {
        let comment, taskId, topicId, commentBelowMax;
        let query;
        let newComment;

        if ('task' in input) taskId = ObjectID(input.task._id);
        if ('topic' in input) topicId = ObjectID(input.topic._id);

        if ('comments' in input) {
            input.comments._id = ObjectID();
            input.comments.owner = ObjectID(input.comments.owner._id);
        }

        if (taskId !== null) {
            query = { task: ObjectID(taskId), count: { $lt: maximumComments } };
        } else if (topicId !== null) {
            query = {
                topic: ObjectID(topicId),
                count: { $lt: maximumComments },
            };
        }

        commentBelowMax = await mongoDB.getAll(collection, query);

        if (commentBelowMax.length > 0) {
            [newComment] = [commentBelowMax][0];

            newComment.comments = [
                ...newComment.comments,
                { ...input.comments },
            ];

            newComment.count = newComment.comments.length;

            await mongoDB.update(collection, newComment._id, newComment);
            comment = newComment;
        } else {
            delete query.count;
            let countPages = await mongoDB.getAll(collection, query, true);
            let pages = countPages + 1;

            newComment = {
                comments: [{ ...input.comments }],
                task: taskId,
                topic: topicId,
                page: pages,
            };
            comment = await crudHelper.create(collection, newComment, defaults);
        }

        return comment;
    },

    editComment: async (root, { taskId, topicId, commentId, input }) => {
        let comment, query;
        try {
            if (taskId !== null) {
                query = {
                    task: ObjectID(taskId),
                    'comments._id': ObjectID(commentId),
                };
            } else if (topicId !== null) {
                query = {
                    topic: ObjectID(taskId),
                    'comments._id': ObjectID(commentId),
                };
            }

            let data = { $set: { 'comments.$.comment': input.comment } };

            await mongoDB.updateSet(collection, query, data);
            [comment] = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }
        return { ...comment };
    },
};
