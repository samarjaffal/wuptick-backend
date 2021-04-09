'use strict';
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const { notificationLoader } = require('../lib/db/dataLoaders');
const collection = 'notifications';
const mongoDB = new MongoLib();
const crudHelper = require('./crud-helper');

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

    createNotification: async (input) => {
        try {
            input.external_id = ObjectID(input.external_id);
            input.recipient = ObjectID(input.recipient);
            input.created_at = new Date();
            let notification = await crudHelper.create(
                collection,
                input,
                defaults
            );
            return notification._id;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    setNotificationAsRead: async (ids) => {
        try {
            let objectIds = ids.map((id) => ObjectID(id));
            let query = { _id: { $in: objectIds } };
            let operator = {
                $set: { read_at: new Date() },
            };
            await mongoDB.updateMany(collection, query, operator);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
};
