'use strict';
const Task = require('../../helpers/task');

module.exports = {
    getTasks: async (_, { moduleId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Task.getTasks(moduleId);
    },
    getTask: async (_, { taskId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Task.getTask(taskId);
    },
};
