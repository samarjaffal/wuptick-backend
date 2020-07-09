'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'topics';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    tag: null,
    url: '',
    collaborators: [],
};

module.exports = {
    createTopic: async (root, { input }) => {
        let topic;
        input.owner = ObjectID(input.owner._id);
        input.module = ObjectID(input.module._id);
        if ('tag' in input) input.tag = ObjectID(input.tag._id);
        topic = await crudHelper.create(collection, input, defaults);
        return topic;
    },
};
