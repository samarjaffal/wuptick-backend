'use strict';
const MongoLib = require('../db/mongo');
const mongoDB = new MongoLib();
const { GraphQLDateTime } = require('graphql-iso-date');
const { ObjectID } = require('mongodb');
const { userLoader } = require('../db/dataLoaders');

module.exports = {
    DateTime: GraphQLDateTime || null,
    Notification: {
        recipient: async ({ recipient }) => {
            let data;
            try {
                if (!recipient) return null;
                data = await userLoader.load(recipient);
            } catch (error) {
                console.error(error);
                return null;
            }
            return data;
        },
    },
};
