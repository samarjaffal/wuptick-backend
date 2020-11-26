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
            throw new Error(error);
        }
        return document;
    },

    delete: async (collection, id, name) => {
        let deletedId;

        try {
            /*  document = await mongoDB.get(collection, id);
            if (!document) throw new Error(`The ${name} doesn't exist`); */
            deletedId = await mongoDB.delete(collection, id);
        } catch (error) {
            console.error(error);
            throw new Error(`Error deleting ${name}: ${id} on ${collection}`);
        }
        return deletedId || null;
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
        let removedId;
        try {
            /*  document = await mongoDB.get(collection, id);
            if (!document) throw new Error(`The ${name} doesn't exist`);
 */
            removedId = await mongoDB.removeFromSet(collection, id, operator);
        } catch (error) {
            console.error(error);
            throw new Error(`Error removing ${name}: ${id} on ${collection} `);
        }
        return removedId;
    },
};
