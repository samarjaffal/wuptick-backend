'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const crudHelper = require('../../helpers/crud-helper');

const collection = 'settings';
const mongoDB = new MongoLib();

const defaults = {};

module.exports = {};
