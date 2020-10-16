const DataLoader = require('dataloader');
const MongoLib = require('./mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

const userLoader = new DataLoader(async (userIds) => {
    let users;
    try {
        users = await mongoHelper
            .getAllDocuments('users', userIds)
            .then((users) =>
                userIds.map((id) => users.find((user) => user._id.equals(id)))
            );
    } catch (error) {
        console.error(error);
    }
    return users;
});

const teamLoader = new DataLoader(async (teamIds) => {
    let teams;
    try {
        teams = await mongoHelper
            .getAllDocuments('teams', teamIds)
            .then((teams) =>
                teamIds.map((id) => teams.find((team) => team._id.equals(id)))
            );
    } catch (error) {
        console.error(error);
    }
    return teams;
});

const projectLoader = new DataLoader(async (projectIds) => {
    let projects;
    try {
        projects = await mongoHelper
            .getAllDocuments('projects', projectIds)
            .then((projects) =>
                projectIds.map((id) =>
                    projects.find((project) => project._id.equals(id))
                )
            );
    } catch (error) {
        console.error(error);
    }
    return projects;
});

const taskLoader = new DataLoader(async (taskIds) => {
    let tasks;
    try {
        tasks = await mongoHelper
            .getAllDocuments('tasks', taskIds)
            .then((tasks) =>
                taskIds.map((id) => tasks.find((task) => task._id.equals(id)))
            );
    } catch (error) {
        console.error(error);
    }
    return tasks;
});

const roleLoader = new DataLoader(async (roleIds) => {
    let roles;
    try {
        roles = await mongoHelper
            .getAllDocuments('roles', roleIds)
            .then((roles) =>
                roleIds.map((id) => roles.find((role) => role._id.equals(id)))
            );
    } catch (error) {
        console.error(error);
    }
    return roles;
});

const moduleLoader = new DataLoader(async (moduleIds) => {
    let modules;
    try {
        modules = await mongoHelper
            .getAllDocuments('modules', moduleIds)
            .then((modules) =>
                moduleIds.map((id) =>
                    modules.find((module) => module._id.equals(id))
                )
            );
    } catch (error) {
        console.error(error);
    }
    return modules;
});

module.exports = {
    userLoader,
    teamLoader,
    projectLoader,
    taskLoader,
    roleLoader,
    moduleLoader,
};
