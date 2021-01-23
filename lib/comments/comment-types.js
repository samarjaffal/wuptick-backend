'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    Comment: {
        topic: async ({ topic }) => {
            let data;
            try {
                if (!topic) return null;
                if ('_id' in topic) topic = ObjectID(topic._id);
                data = await mongoDB.get('topics', topic);
            } catch (error) {
                console.error(error);
            }
            return data || {};
        },

        task: async ({ task }) => {
            let data;
            try {
                if (!task) return null;
                if ('_id' in task) task = ObjectID(task._id);
                data = await mongoDB.get('tasks', task);
            } catch (error) {
                console.error(error);
            }
            return data || {};
        },

        comments: async ({ comments }) => {
            let userIds, usersData;
            let newComments;

            try {
                userIds =
                    comments.length > 0
                        ? comments.map((object) => ObjectID(object.owner))
                        : [];

                usersData = await mongoHelper.getAllDocuments('users', userIds);

                newComments = comments.map((comment) => {
                    let user = usersData.find(
                        (user) => String(user._id) == String(comment.owner)
                    );
                    if (!user) return;
                    return { ...comment, owner: { ...user } };
                });
            } catch (error) {
                console.error(error);
            }

            return newComments || [];
        },
    },
};
