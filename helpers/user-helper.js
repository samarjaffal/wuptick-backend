const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoDB = new MongoLib();

const getUserInfo = async (userId) => {
    try {
        let user = await mongoDB.get('users', userId);
        return user || null;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { getUserInfo };
