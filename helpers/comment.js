const MongoLib = require('../lib/db/mongo');
const Module = require('./module-helper');
const mongoDB = new MongoLib();
const crudHelper = require('./crud-helper');
const collection = 'comments';
const { ObjectID } = require('mongodb');

module.exports = {
    getCommentsForTask: async (taskId) => {
        let comments;
        try {
            const query = {
                task: ObjectID(taskId),
            };
            comments = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return comments || [];
    },
};
