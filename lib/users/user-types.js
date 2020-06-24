'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    User: {
        teams: async ({ teams }) => {
            let teamsData, ids;

            try {
                ids = teams ? teams : [];
                teamsData = await mongoHelper.getAllDocuments('teams', ids);
            } catch (error) {
                console.error(error);
            }

            return teamsData;
        },

        favorite_projects: async ({ favorite_projects }) => {
            let projectsData, ids;
            try {
                ids = favorite_projects ? favorite_projects : [];

                projectsData = await mongoHelper.getAllDocuments(
                    'projects',
                    ids
                );
            } catch (error) {
                console.error(error);
            }
            return projectsData;
        },

        favorite_tasks: async ({ favorite_tasks }) => {
            let tasksData, ids;
            try {
                ids = favorite_tasks ? favorite_tasks : [];
                tasksData = await mongoHelper.getAllDocuments('tasks', ids);
            } catch (error) {
                console.error(error);
            }

            return tasksData;
        },
    },

    Team: {
        owner: async ({ owner }) => {
            let userData;
            try {
                if (!owner) return null;
                userData = await mongoDB.get('users', owner);
            } catch (error) {
                console.error(error);
            }
            return userData;
        },
    },
};
