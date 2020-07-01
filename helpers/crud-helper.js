'use strict';
const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');

const mongoDB = new MongoLib();

module.exports = {
    create: async (collection, input, defaults) => {
        const document = { ...defaults, ...input };
        try {
            let id;
            id = await mongoDB.create(collection, document);
            document._id = id;
        } catch (error) {
            console.error(error);
        }
        return document;
    },

    edit: async (collection, id, input, name) => {
        let document;
        try {
            document = await mongoDB.get(collection, id);
            if (!document) throw new Error(`The ${name} doesn't exist`);
            await mongoDB.update(collection, id, input);
            document = { ...document, ...input };
        } catch (error) {
            console.error(error);
        }
        return document;
    },

    delete: async (collection, id, name) => {
        let document, deletedDocument;

        try {
            document = await mongoDB.get(collection, id);
            if (!document) throw new Error(`The ${name} doesn't exist`);
            await mongoDB.delete(collection, id);
            deletedDocument = { ...document };
        } catch (error) {
            console.error(error);
        }
        return deletedDocument;
    },

    addSet: async (collection, id, _operator, name) => {
        let document;
        try {
            const operator = _operator.format;
            document = await mongoDB.get(collection, id);

            if (!document) throw new Error(`The ${name} doesn't exist`);

            await mongoDB.addToSet(collection, id, operator);
            document = {
                ...document,
                [_operator.key]: [{ ...operator[_operator.set] }],
            };
        } catch (error) {
            console.error(error);
        }
        return document;
    },

    removeSet: async (collection, id, name, operator) => {
        let document;
        try {
            document = await mongoDB.get(collection, id);
            if (!document) throw new Error(`The ${name} doesn't exist`);

            await mongoDB.removeFromSet(collection, id, operator);
        } catch (error) {
            console.error(error);
        }
        return document;
    },
};
