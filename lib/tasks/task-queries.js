'use strict';
const MongoLib = require('../db/mongo');
const collection = 'tasks';

const Task = require('../../helpers/task');

module.exports = {
    getTasks: async (_, { moduleId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Task.getTasks(moduleId);
    },
};
