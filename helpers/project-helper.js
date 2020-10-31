const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('./mongo-helper');

module.exports = {
    addMemberToProject: async (member, projectId) => {
        try {
            await mongoHelper.addUniqueElementToArray(
                'projects',
                ObjectID(projectId),
                'members',
                member
            );
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
};
