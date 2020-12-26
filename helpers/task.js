const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const collection = 'tasks';
const { ObjectID } = require('mongodb');

module.exports = {
    getTasks: async (moduleId) => {
        let tasks;
        try {
            const query = { module: ObjectID(moduleId) };
            tasks = await mongoDB.getAll(collection, query);
        } catch (error) {
            console.error(error);
        }

        return tasks || [];
    },

    assignTask: async (taskId, userId) => {
        try {
            await mongoDB.update(collection, taskId, {
                assigned: ObjectID(userId),
            });
            return userId;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
};
