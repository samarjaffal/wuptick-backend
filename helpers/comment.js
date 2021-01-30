const MongoLib = require('../lib/db/mongo');
const Module = require('./module-helper');
const mongoDB = new MongoLib();
const crudHelper = require('./crud-helper');
const collection = 'comments';
const { ObjectID } = require('mongodb');

const defaults = {
    page: 1,
    count: 1,
    comments: [],
};
const maximumComments = 6;

module.exports = {
    getCommentsForTask: async (taskId) => {
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

    createComment: async (input) => {
        let comment, taskId, topicId, commentBelowMax;
        let query;
        let newComment;

        if ('task' in input) taskId = ObjectID(input.task._id);
        if ('topic' in input) topicId = ObjectID(input.topic._id);

        if ('comments' in input) {
            input.comments._id = ObjectID();
            input.comments.owner = ObjectID(input.comments.owner._id);
            if (!'commentJson' in input.comments) {
                input.comments.commentJson = '';
            }
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

            /* newComment.comments = [...newComment.comments]; */
            newComment.comments.unshift({ ...input.comments });

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

    editComment: async (input) => {
        let comment, query;
        try {
            if (input.taskId !== null) {
                query = {
                    task: ObjectID(input.taskId),
                    'comments._id': ObjectID(input.commentId),
                };
            } else if (input.topicId !== null) {
                query = {
                    topic: ObjectID(input.topicId),
                    'comments._id': ObjectID(input.commentId),
                };
            }

            let data = {
                $set: {
                    'comments.$.comment': input.comment,
                    'comments.$.commentJson': input.commentJson,
                    'comments.$.updated_at': input.updated_at,
                },
            };

            await mongoDB.updateSet(collection, query, data);
            [comment] = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }
        return { ...comment };
    },
};
