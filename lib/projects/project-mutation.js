'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const collection = 'projects';
const mongoDB = new MongoLib();

const defaults = {
    description: '',
    image: '',
    color: '',
    privacy: 'team',
    status: 'active',
    members: [],
    tag: null,
};

module.exports = {
    createProject: async (root, { input }) => {
        let projectId;

        input.owner = ObjectID(input.owner._id);
        input.team_owner = ObjectID(input.team_owner._id);

        const newProject = { ...defaults, ...input };
        try {
            projectId = await mongoDB.create(collection, newProject);
            newProject._id = projectId;
        } catch (error) {
            console.error(error);
        }
        return newProject;
    },
};