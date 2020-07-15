'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'roles';
const mongoDB = new MongoLib();

const defaults = {};

module.exports = {
    createRole: async (root, { input }) => {
        let role;
        role = await crudHelper.create(collection, input, defaults);
        return role;
    },
};
