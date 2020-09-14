'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');
const { userLoader, projectLoader } = require('../db/dataLoaders');
const mongoDB = new MongoLib();

module.exports = {
    Team: {
        owner: async ({ owner }) => {
            let userData;
            try {
                if (!owner) return null;
                /* console.log(owner, 'owner'); */
                userData = await userLoader.loadMany([owner]);
            } catch (error) {
                console.error(error);
            }
            return userData;
        },

        projects: async ({ projects }) => {
            let projectsData, ids;

            try {
                ids = projects ? projects : [];
                /* projectsData = await mongoHelper.getAllDocuments(
                    'projects',
                    ids
                ); */
                projectsData = await projectLoader.loadMany(ids);
            } catch (error) {
                console.error(error);
            }

            return projectsData;
        },
    },
};
