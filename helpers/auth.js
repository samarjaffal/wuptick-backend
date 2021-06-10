const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'users';
const mongoDB = new MongoLib();

const revokeRFTokensForUser = async (userId) => {
    const query = { _id: ObjectID(userId) };
    const data = { $inc: { tk_version: 1 } };
    try {
        await mongoDB.updateSet(collection, query, data);
    } catch (error) {
        console.log(error);
        throw new Error(`Error on revoking the token for user: ${userId}`);
    }
    return true;
}


const inactivateAccount = async (userId) => {
    try {
        if (!userId) return false;
        const data = { status: 'inactive' };
        return await mongoDB.update(collection, userId, data);
    } catch (error) {
        console.log(error);
        throw new Error(`Error when inactivating the account for user: ${userId}`);
    }
}


module.exports = { revokeRFTokensForUser, inactivateAccount }