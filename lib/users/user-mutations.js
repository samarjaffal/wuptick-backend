'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');

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
};
