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
            let newUsersData;

            try {
                userIds =
                    comments.length > 0
                        ? comments.map((object) => ObjectID(object.owner))
                        : [];

                usersData = await mongoHelper.getAllDocuments('users', userIds);

                newUsersData = usersData.map((data) => {
                    let owner = comments.find(
                        (comment) => String(comment.owner) == String(data._id)
                    );
                    let format = (({ _id, created_at, comment }) => ({
                        _id,
                        created_at,
                        comment,
                    }))(owner);
                    let obj = owner ? { owner: { ...data }, ...format } : {};
                    return obj;
                });
            } catch (error) {
                console.error(error);
            }

            return newUsersData;
        },
    },
};
