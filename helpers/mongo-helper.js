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

    getAllDocuments: async (collection, ids) => {
        let documents =
            ids.length > 0
                ? await mongoDB.getAll(collection, {
                      _id: { $in: ids },
                  })
                : [];
        return documents;
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

    FindObjectDataFromArrayWithID: (arrayData, arrayFind, idData, idFind) => {
        let newObject =
            arrayData.length > 0
                ? arrayData.find((data) => {
                      let object = arrayFind.find(
                          (object) =>
                              String(object[idFind]) == String(data[idData])
                      );
                      return object ? { ...data } : {};
                  })
                : {};
        return newObject;
    },

    addUniqueElementToArray: async (collection, queryId, key, notMatchId) => {
        try {
            const query = {
                _id: queryId,
                [key]: {
                    $not: {
                        $elemMatch: { $eq: notMatchId },
                    },
                },
            };

            const data = { $addToSet: { [key]: notMatchId } };
            let updatedDocument = await mongoDB.findOneAndUpdate(
                collection,
                query,
                data
            );
            const result =
                updatedDocument !== null ? updatedDocument._id : null;
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    },
};
