'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const MongoHelper = require('../../helpers/mongo-helper');
const mongoHelper = require('../../helpers/mongo-helper');

const collection = 'users';
const mongoDB = new MongoLib();

const defaults = {
    last_name: '',
    occupation: '',
    birthday: null,
    avatar: '',
    status: 'active',
    level: 'user',
};

module.exports = {
    createUser: async (root, { input }) => {
        let userId;
        let teams, teamIds;
        let projects;
        let tasks, taskIds;

        //validating teams
        teams = 'teams' in input ? input.teams : [];
        teamIds = await mongoHelper.getIdsFromArray(teams);
        input.teams = await mongoHelper.getExistingIds(teamIds, 'teams');

        //validating projects
        projects = 'projects' in input ? input.projects : [];
        input.projects = await mongoHelper.getExistingDocuments(
            projects,
            'projects'
        );

        //validating tasks
        tasks = 'favorite_tasks' in input ? input.favorite_tasks : [];
        taskIds = await mongoHelper.getIdsFromArray(tasks);
        input.favorite_tasks = await mongoHelper.getExistingIds(
            taskIds,
            'tasks'
        );

        const newUser = { ...defaults, ...input };
        try {
            userId = await mongoDB.create(collection, newUser);
            newUser._id = userId;
        } catch (error) {
            console.error(error);
        }
        return newUser;
    },

    addTeam: async (root, { userId, teamId }) => {
        let user, team;
        try {
            user = await mongoDB.get(collection, userId);
            team = await mongoDB.get('teams', teamId);

            if (!user) throw new Error("The user doesn't exist");
            if (!team) throw new Error("The team doesn't exist");

            const operator = { teams: ObjectID(teamId) };
            await mongoDB.addToSet(collection, userId, operator);
        } catch (error) {
            console.error(error);
        }

        return user;
    },

    addProject: async (root, { userId, projectId }) => {
        let user, project;
        try {
            user = await mongoDB.get(collection, userId);
            project = await mongoDB.get('projects', projectId);

            if (!user) throw new Error("The user doesn't exist");
            if (!project) throw new Error("The project doesn't exist");

            const operator = {
                projects: { _id: ObjectID(projectId), favorite: false },
            };
            await mongoDB.addToSet(collection, userId, operator);
        } catch (error) {
            console.error(error);
        }

        return user;
    },

    addTask: async (root, { userId, taskId }) => {
        let user, task;
        try {
            user = await mongoDB.get(collection, userId);
            task = await mongoDB.get('tasks', taskId);

            if (!user) throw new Error("The user doesn't exist");
            if (!task) throw new Error("The task doesn't exist");

            const operatorUser = { favorite_tasks: ObjectID(taskId) };
            const operatorTask = { collaborators: ObjectID(userId) };
            let addedTaskToUser = await mongoDB.addToSet(
                collection,
                userId,
                operatorUser
            );
            if (!addedTaskToUser)
                throw new Error('Error trying to add a Task to User.');
            let addedUserToTask = await mongoDB.addToSet(
                'tasks',
                taskId,
                operatorTask
            );
            if (!addedUserToTask)
                throw new Error('Error trying to add a Collaborator to Task');

            //TODO: How can I rollback if some of the functions gives me an error?
        } catch (error) {
            console.error(error);
        }
        return user;
    },
};
