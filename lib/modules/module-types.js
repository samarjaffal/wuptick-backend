'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    Module: {
        project: async ({ project }) => {
            let projectData;
            try {
                if (!project) return null;
                projectData = await mongoDB.get('projects', project);
            } catch (error) {
                console.error(error);
            }
            return projectData;
        },

        task_lists: async ({ task_lists }) => {
            let tasksData, ids, tasks;
            let flatIds = [];
            try {
                ids =
                    task_lists.length > 0
                        ? task_lists.map((list) =>
                              list.tasks.map((task) => ObjectID(task))
                          )
                        : [];

                ids.forEach((array) => {
                    flatIds = flatIds.concat(array);
                });

                ids = flatIds;
                tasksData = await mongoHelper.getAllDocuments('tasks', ids);
                tasks = task_lists.map((list) => {
                    let taskData = [];
                    taskData = list.tasks.map((task) => {
                        return tasksData.find((data) => data._id.equals(task));
                    });
                    return { ...list, tasks: taskData };
                });
            } catch (error) {
                console.error(error);
            }

            return tasks;
        },
    },
};
