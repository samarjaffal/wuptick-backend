'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');

const mongoDB = new MongoLib();

module.exports = {
    User: {
        teams: async ({ teams }) => {
            let teamsData, ids;

            try {
                ids = teams ? teams : [];
                teamsData =
                    ids.length > 0
                        ? await mongoDB.getAll('teams', { _id: { $in: ids } })
                        : [];
            } catch (error) {
                console.error(error);
            }

            return teamsData;
        },

        projects: async ({ projects }) => {
            let projectsData, ids;

            try {
                ids = projects ? projects.map((object) => object._id) : [];
                projectsData =
                    ids.length > 0
                        ? await mongoDB.getAll('projects', {
                              _id: { $in: ids },
                          })
                        : [];
            } catch (error) {
                console.error(error);
            }

            return projectsData;
        },

        favorite_tasks: async ({ favorite_tasks }) => {
            let tasksData, ids;
            try {
                ids = favorite_tasks ? favorite_tasks : [];
                tasksData =
                    ids.length > 0
                        ? await mongoDB.getAll('tasks', { _id: { $in: ids } })
                        : [];
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
