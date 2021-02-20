'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'tags';
const Tag = require('../../helpers/tag');

module.exports = {
    createTag: async (root, { input }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Tag.createTag(input);
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

    deleteTag: async (root, { tagId }) => {
        let tag;
        tag = await crudHelper.delete(collection, tagId, 'tag');
        return tag;
    },
};
