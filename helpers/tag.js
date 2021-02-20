const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const { ObjectID } = require('mongodb');
const crudHelper = require('./crud-helper');
const collection = 'tags';

module.exports = {
    getTags: async (teamId) => {
        let tags;
        try {
            let query = { team: ObjectID(teamId) };
            tags = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return tags || [];
    },
};
