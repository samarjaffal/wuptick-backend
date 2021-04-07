'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'notifications';
const mongoDB = new MongoLib();

const defaults = {
    created_at: '',
    read_at: '',
};

module.exports = {};
