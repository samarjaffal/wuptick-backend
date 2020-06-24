'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
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
        const newUser = { ...defaults, ...input };
        try {
            userId = await mongoDB.create(collection, newUser);
            newUser._id = userId;
        } catch (error) {
            console.error(error);
        }
        return newUser;
    },

    editUser: async (root, { userId, input }) => {
        let user;
        try {
            await mongoDB.update(collection, userId, input);
            user = await mongoDB.get(collection, userId);
            if (!user) throw new Error("The user doesn't exist");
        } catch (error) {
            console.error(error);
        }
        return user;
    },

    deleteUser: async (root, { userId }) => {
        let user, deletedUser;

        try {
            user = await mongoDB.get(collection, userId);
            if (!user) throw new Error("The user doesn't exist");
            deletedUser = await mongoDB.delete(collection, userId);
            deletedUser = { ...user };
        } catch (error) {
            console.error(error);
        }
        return deletedUser;
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

    removeTeam: async (root, { userId, teamId }) => {
        let user, team;
        try {
            team = await mongoDB.get('teams', teamId);
            if (!team) throw new Error("The team doesn't exist");

            const operator = { teams: ObjectID(teamId) };
            await mongoDB.removeFromSet(collection, userId, operator);

            user = await mongoDB.get(collection, userId);
            if (!user) throw new Error("The user doesn't exist");
        } catch (error) {
            console.error(error);
        }

        return user;
    },

    addFavoriteProject: async (root, { userId, projectId }) => {
        let user, project;
        try {
            user = await mongoDB.get(collection, userId);
            project = await mongoDB.get('projects', projectId);

            if (!user) throw new Error("The user doesn't exist");
            if (!project) throw new Error("The project doesn't exist");

            const operator = { favorite_projects: ObjectID(projectId) };

            await mongoDB.addToSet(collection, userId, operator);

            user = {
                ...user,
                favorite_projects: [{ ...operator.favorite_projects }],
            };
        } catch (error) {
            console.error(error);
        }
        return user;
    },

    removeFavoriteProject: async (root, { userId, projectId }) => {
        let user, project;

        try {
            project = await mongoDB.get('projects', projectId);

            if (!project) throw new Error("The project doesn't exist");

            const operator = { favorite_projects: ObjectID(projectId) };

            await mongoDB.removeFromSet(collection, userId, operator);

            user = await mongoDB.get(collection, userId);
            if (!user) throw new Error("The user doesn't exist");
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

            const operator = { favorite_tasks: ObjectID(taskId) };

            await mongoDB.addToSet(collection, userId, operator);
            console.log(user);
        } catch (error) {
            console.error(error);
        }
        return user;
    },

    removeTask: async (root, { userId, taskId }) => {
        let user, task;
        try {
            task = await mongoDB.get('tasks', taskId);
            if (!task) throw new Error("The task doesn't exist");

            const operator = { favorite_tasks: ObjectID(taskId) };

            await mongoDB.removeFromSet(collection, userId, operator);

            user = await mongoDB.get(collection, userId);
            if (!user) throw new Error("The user doesn't exist");
        } catch (error) {
            console.error(error);
        }
        return user;
    },
};
