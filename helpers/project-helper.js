const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('./mongo-helper');
const crudHelper = require('./crud-helper');
const Team = require('./team-helper');

const collection = 'projects';
const defaults = {
    description: '',
    image: '',
    color: '',
    privacy: 'team',
    status: 'active',
    members: [],
    updated_at: null,
    tag: null,
};

module.exports = {
    createProject: async (input) => {
        try {
            input.owner = ObjectID(input.owner._id);
            input.team_owner = ObjectID(input.team_owner._id);
            input.created_at = new Date();
            let project = await crudHelper.create(collection, input, defaults);
            await Team.addProject(project.team_owner, project._id);
            return project;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    addMemberToProject: async (member, projectId) => {
        try {
            let memberId = await mongoHelper.addUniqueElementToArray(
                'projects',
                ObjectID(projectId),
                'members',
                member
            );

            return memberId || null;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
};
