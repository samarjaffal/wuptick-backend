const DataLoader = require('dataloader');
const MongoLib = require('./mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

const teamLoader = new DataLoader(async (teamIds) => {
    let teams;
    try {
        teams = await mongoHelper.getAllDocuments('teams', teamIds);
    } catch (error) {
        console.error(error);
    }
    return teams;
});

const projectLoader = new DataLoader(async (projectIds) => {
    let projects;
    try {
        projects = await mongoHelper.getAllDocuments('projects', projectIds);
    } catch (error) {
        console.error(error);
    }
    return projects;
});

const taskLoader = new DataLoader(async (taskIds) => {
    let tasks;
    try {
        tasks = await mongoHelper.getAllDocuments('tasks', taskIds);
    } catch (error) {
        console.error(error);
    }
    return tasks;
});

module.exports = {
    teamLoader,
    projectLoader,
    taskLoader,
};
