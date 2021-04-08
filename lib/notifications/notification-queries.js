'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'notifications';
const mongoDB = new MongoLib();
const Notification = require('../../helpers/notification');

module.exports = {
    getNotifications: async (root, {}, context) => {
        if (!context.isAuth) {
            return null;
        }

        const userId = context.req._id;
        if (!userId) return null;

        return await Notification.getNotifications(userId);
    },
};
