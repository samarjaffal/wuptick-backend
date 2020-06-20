'use strict';
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');

const mongoDB = new MongoLib();

module.exports = {
    getIdsFromArray: async (array) => {
        let ids;
        ids =
            array.length > 0 ? array.map((newObj) => ObjectID(newObj._id)) : [];
        return ids;
    },

    getExistingIds: async (ids, collection) => {
        let existingIds;

        existingIds =
            ids.length > 0
                ? await mongoDB.getAll(collection, {
                      _id: { $in: ids },
                  })
                : [];
        ids =
            existingIds.length > 0
                ? existingIds.map((object) => ObjectID(object._id))
                : [];

        return ids;
    },
};
