const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('./mongo-helper');
const crudHelper = require('./crud-helper');

const collection = 'projects';

module.exports = {
    addProject: async (teamId, projectId) => {
        try {
            let updatedId;
            //add teamId to teams array in user if teams not exists
            updatedId = await mongoHelper.addUniqueElementToArray(
                'teams',
                teamId,
                'projects',
                ObjectID(projectId)
            );
            return updatedId;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
};
