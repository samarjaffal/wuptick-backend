'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'notifications';
const mongoDB = new MongoLib();
const Notification = require('../../helpers/notification');

const defaults = {
    created_at: '',
    read_at: '',
};

module.exports = {
    createNotification: async (root, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Notification.createNotification(input);
    },

    setNotificationAsRead: async (root, { ids }, context) => {
        if (!context.isAuth) {
            return null;
        }

        return await Notification.setNotificationAsRead(ids);
    },
};
