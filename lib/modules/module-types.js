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
            let tasksData, ids;
            try {
                ids =
                    task_lists.length > 0
                        ? task_lists.map((list) => {
                              return list.tasks.map((task) => ObjectID(task));
                          })
                        : [];
                ids = ids[0];
                tasksData = await mongoHelper.getAllDocuments('tasks', ids);
            } catch (error) {
                console.error(error);
            }
            let [taskList] = task_lists;
            taskList.tasks = tasksData;
            return [{ ...taskList }];
        },
    },
};
