'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'tags';
const mongoDB = new MongoLib();

const defaults = {
    color: '',
};

module.exports = {
    createTag: async (root, { input }) => {
        let tag;
        input.team = ObjectID(input.team._id);
        tag = await crudHelper.create(collection, input, defaults);
        return tag;
    },

    editTag: async (root, { tagId, input }) => {
        let tag;
        try {
            let inputData = { ...input };
            tag = await crudHelper.edit(collection, tagId, inputData, 'tag');
        } catch (error) {
            console.error(error);
        }
        return tag;
    },
};
