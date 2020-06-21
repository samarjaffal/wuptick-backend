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

        projects: async ({ projects }) => {
            let projectsData, ids;
            let newProjectData;
            try {
                ids = projects
                    ? projects.map((object) => ObjectID(object.project))
                    : [];

                projectsData = await mongoHelper.getAllDocuments(
                    'projects',
                    ids
                );

                newProjectData = projectsData.map((data) => {
                    let project = projects.find(
                        (project) => String(project.project) == String(data._id)
                    );
                    let format = (({ favorite }) => ({ favorite }))(project);
                    let obj = project
                        ? { project: { ...data }, ...format }
                        : {};
                    return obj;
                });
            } catch (error) {
                console.error(error);
            }
            return newProjectData;
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
