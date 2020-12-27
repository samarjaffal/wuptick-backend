const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoDB = new MongoLib();
const crudHelper = require('./crud-helper');
const collection = 'users';

const getUserInfo = async (userId) => {
    try {
        let user = await mongoDB.get('users', userId);
        return user || null;
    } catch (error) {
        console.log(error);
    }
};

const addFavoriteTask = async (userId, taskId) => {
    let user;
    const operator = {
        format: { favorite_tasks: ObjectID(taskId) },
        key: 'favorite_tasks',
        set: 'favorite_tasks',
    };
    await crudHelper.addSet(collection, userId, operator, 'user');
    return taskId;
};

const removeFavoriteTask = async (userId, taskId) => {
    let user;
    const operator = { favorite_tasks: ObjectID(taskId) };
    await crudHelper.removeSet(collection, userId, 'user', operator);
    return taskId;
};

const toggleFavTask = async (state, userId, taskId) => {
    try {
        if (state) {
            return await addFavoriteTask(userId, taskId);
        } else {
            return await removeFavoriteTask(userId, taskId);
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
};

module.exports = { getUserInfo, toggleFavTask };
