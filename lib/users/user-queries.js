'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');
const collection = 'users';
const mongoDB = new MongoLib();
const { generateLog } = require('../functions/feed');

module.exports = {
    me: async (_, {}, context) => {
        let user, id;
        if (!context.isAuth) {
            return null;
        }
        try {
            id = context.req._id;
            user = await mongoDB.get(collection, id);
            return user || null;
        } catch (error) {
            console.error(error);
            return null;
        }
    },

    getUsers: async () => {
        try {
            const query = {};
            const users = await mongoDB.getAll(collection, query);
            return users || [];
        } catch (error) {
            console.error(error);
        }
    },

    testUser: (root, args, context) => {
        if (!context.isAuth) {
            throw new Error(`Unauthenticated!`);
        }
        return true;
    },

    getLastActivity: async (_, {}, context) => {
        let team, projects;
        let currentDate = new Date();
        let currentMonth = currentDate.getMonth() + 1;
        try {
            const teamId = ObjectID('5ef4875caea1ea2cfccb6fba');
            team = await mongoDB.get('teams', teamId);
            let projectIds = team.projects;

            const query = {
                _id: { $in: projectIds },
                $expr: { $eq: [{ $month: '$created_at' }, currentMonth] },
            };
            let projects = await mongoDB.getAll('projects', query, false, 3);

            projectIds = await mongoHelper.getIdsFromArray(projects);

            const queryModules = {
                project: { $in: projectIds },
                $expr: { $eq: [{ $month: '$created_at' }, currentMonth] },
            };

            let modules = await mongoDB.getAll(
                'modules',
                queryModules,
                false,
                3
            );

            let taskLists = modules[0].task_lists;

            let taskIds = taskLists
                .map((list) => list.tasks.map((task) => task))
                .flat();

            const queryTasks = {
                _id: { $in: taskIds },
                $expr: { $eq: [{ $month: '$created_at' }, currentMonth] },
            };

            let tasks = await mongoDB.getAll('tasks', queryTasks, false, 3);

            let taskLogs = await generateLog(teamId, tasks, 'task');
            let projectLogs = await generateLog(teamId, projects, 'project');
            const logs = [...taskLogs, ...projectLogs];

            const sortedLogs = logs.sort(function (a, b) {
                var dateA = new Date(a.dateFilter),
                    dateB = new Date(b.dateFilter);
                return dateB - dateA;
            });
            console.log(logs, 'logs');
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },
};
