'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');
const { teamLoader, projectLoader, taskLoader } = require('../db/dataLoaders');

const mongoDB = new MongoLib();

module.exports = {
    User: {
        teams: async ({ teams }) => {
            let teamsData, ids;

            try {
                ids = teams ? teams : [];
                /* teamsData = await mongoHelper.getAllDocuments('teams', ids); */
                teamsData = await teamLoader.loadMany(ids);
            } catch (error) {
                console.error(error);
            }

            return teamsData;
        },

        favorite_projects: async ({ favorite_projects }) => {
            let projectsData, ids;
            try {
                ids = favorite_projects ? favorite_projects : [];

                /*  projectsData = await mongoHelper.getAllDocuments(
                    'projects',
                    ids
                ); */
                projectsData = await projectLoader.loadMany(ids);
            } catch (error) {
                console.error(error);
            }
            return projectsData;
        },

        favorite_tasks: async ({ favorite_tasks }) => {
            let tasksData, ids;
            try {
                ids = favorite_tasks ? favorite_tasks : [];
                /*  tasksData = await mongoHelper.getAllDocuments('tasks', ids); */
                tasksData = await taskLoader.loadMany(ids);
            } catch (error) {
                console.error(error);
            }

            return tasksData;
        },
    },
};
