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

    getExistingIds: async (ids, collection, stringFormat = false) => {
        let existingIds;

        existingIds =
            ids.length > 0
                ? await mongoDB.getAll(collection, {
                      _id: { $in: ids },
                  })
                : [];
        ids =
            existingIds.length > 0
                ? stringFormat == false
                    ? existingIds.map((object) => ObjectID(object._id))
                    : existingIds.map((object) => object._id.toString())
                : [];
        return ids;
    },

    getExistingDocuments: async (documents, collection) => {
        let ids, existingIds;
        let existingDocuments;

        ids = await module.exports.getIdsFromArray(documents);
        existingIds = await module.exports.getExistingIds(
            ids,
            collection,
            true
        );

        existingDocuments = documents
            .filter((document) => existingIds.includes(document._id))
            .map((document) => {
                let newDocument = { ...document, _id: ObjectID(document._id) };
                return newDocument;
            });
        return existingDocuments;
    },
};
