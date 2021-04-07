'use strict';
const MongoLib = require('../db/mongo');
const mongoDB = new MongoLib();
const { GraphQLDateTime } = require('graphql-iso-date');
const { ObjectID } = require('mongodb');
const { userLoader } = require('../db/dataLoaders');

module.exports = {
    DateTime: GraphQLDateTime || null,

    recipient: async ({ recipient }) => {
        let data;
        try {
            if (Object.keys(recipient).length === 0) return null;
            const { _id: userId } = recipient;
            data = await userLoader.load(userId);
        } catch (error) {
            console.error(error);
            return null;
        }
        return data;
    },
};
