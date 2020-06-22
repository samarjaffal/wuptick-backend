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
        // let teams, teamIds;
        // let projects;
        // let tasks, taskIds;

        // //validating teams
        // teams = 'teams' in input ? input.teams : [];
        // teamIds = await mongoHelper.getIdsFromArray(teams);
        // input.teams = await mongoHelper.getExistingIds(teamIds, 'teams');

        // //validating projects
        // //TODO: check later if I need to add the user Object to Projects collection??
        // projects = 'projects' in input ? input.projects : [];
        // input.projects = await mongoHelper.getExistingDocuments(
        //     projects,
        //     'projects'
        // );

        // //validating tasks
        // tasks = 'favorite_tasks' in input ? input.favorite_tasks : [];
        // taskIds = await mongoHelper.getIdsFromArray(tasks);
        // input.favorite_tasks = await mongoHelper.getExistingIds(
        //     taskIds,
        //     'tasks'
        // );

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
            console.log(error);
        }
        return user;
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

    addProject: async (root, { userId, projectId, roleId, teamId }) => {
        let user, project, role, team;

        try {
            user = await mongoDB.get(collection, userId);
            project = await mongoDB.get('projects', projectId);
            role =
                roleId && typeof roleId !== 'undefined'
                    ? await mongoDB.get('roles', roleId)
                    : await mongoDB.findOne('roles', { role: 'member' });
            team = await mongoDB.get('teams', teamId);

            if (!user) throw new Error("The user doesn't exist");
            if (!project) throw new Error("The project doesn't exist");
            if (!role) throw new Error("The role doesn't exist");
            if (!team) throw new Error("The team doesn't exist");

            const operatorProject = {
                members: {
                    _id: ObjectID(userId),
                    name: user.name,
                    avatar: user.avatar,
                    role_id: ObjectID(role._id),
                    team_id: ObjectID(teamId),
                },
            };

            const operatorUser = {
                projects: { project: ObjectID(projectId), favorite: false },
            };

            let addedProjectToUser = await mongoDB.addToSet(
                collection,
                userId,
                operatorUser
            );
            if (!addedProjectToUser)
                throw new Error('Error trying to add a Project to User.');

            let addedUserToProject = await mongoDB.addToSet(
                'projects',
                projectId,
                operatorProject
            );
            if (!addedUserToProject)
                throw new Error('Error trying to add a Member to Project.');

            user = { ...user, projects: [{ ...operatorUser.projects }] };
            //TODO: How can I rollback if some of the functions gives me an error?
        } catch (error) {
            console.error(error);
        }
        console.log('user', user);
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

    updateFavoriteProject: async (root, { userId, input }) => {
        let user;
        try {
            user = await mongoDB.get(collection, userId);
            let query = {
                _id: ObjectID(userId),
                'projects.project': ObjectID(input.project),
            };
            let data = { 'projects.$.favorite': input.favorite };
            await mongoDB.updateOne(collection, query, data);
            if (!user) throw new Error("The user doesn't exist");
        } catch (error) {
            console.log(error);
        }
        user = { ...user, projects: [{ ...input }] };
        return user;
    },
};
