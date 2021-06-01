const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const { uploadImage } = require('../utils/cloudinary');
const mongoDB = new MongoLib();
const crudHelper = require('./crud-helper');
const { uploadFile } = require('./gd-files-upload');
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

const updateAvatar = async (imgStr, fileName, userId) => {
    try {
        const folder = 'avatars';
        const base64 = true;
        const uploadResponse = await uploadFile(
            userId,
            folder,
            imgStr,
            fileName,
            base64
        );

        const { url } = uploadResponse;

        if (url) {
            const input = { avatar: url };
            await crudHelper.edit(collection, ObjectID(userId), input, 'user');
        }

        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

module.exports = { getUserInfo, toggleFavTask, updateAvatar };
