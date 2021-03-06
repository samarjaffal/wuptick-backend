const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const { ObjectID } = require('mongodb');
const crudHelper = require('./crud-helper');
const collection = 'tags';

const defaults = {
    name: 'General',
    color: '',
};

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

    createTag: async (input) => {
        let tag;
        input.team = ObjectID(input.team);
        input.created_at = new Date();
        tag = await crudHelper.create(collection, input, defaults);
        return tag;
    },

    deleteTag: async (tagId) => {
        let tag;
        tag = await crudHelper.delete(collection, tagId, 'tag');
        return Boolean(tag);
    },
};
