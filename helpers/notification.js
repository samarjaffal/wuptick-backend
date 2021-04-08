'use strict';
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const { notificationLoader } = require('../lib/db/dataLoaders');
const collection = 'notifications';
const mongoDB = new MongoLib();

const defaults = {
    created_at: '',
    read_at: '',
};

const LIMIT_NOTIFICATIONS = 30;

module.exports = {
    getNotifications: async (userId) => {
        let notifications;
        try {
            const query = { recipient: ObjectID(userId) };
            const sort = { created_at: -1 };
            notifications = await mongoDB.getAll(
                collection,
                query,
                false,
                LIMIT_NOTIFICATIONS,
                sort
            );
        } catch (error) {
            console.error(error);
        }
        return notifications || [];
    },
};
