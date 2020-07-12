'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'links';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
};

module.exports = {
    createLink: async (root, { input }) => {
        let link;
        input.owner = ObjectID(input.owner._id);
        input.module = ObjectID(input.module._id);
        link = await crudHelper.create(collection, input, defaults);
        return link;
    },
};
