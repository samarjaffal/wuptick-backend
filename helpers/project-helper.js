const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('./mongo-helper');
const crudHelper = require('./crud-helper');
const UserProject = require('./user-project');
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

const mongoDB = new MongoLib();

module.exports = {
    createProject: async (input) => {
        try {
            input.owner = ObjectID(input.owner._id);
            input.team_owner = ObjectID(input.team_owner._id);
            input.created_at = new Date();
            let project = await crudHelper.create(collection, input, defaults);
            await Team.addProject(project.team_owner, project._id);

            let role = await mongoDB.findOne('roles', {
                name: 'member',
            });

            let member = {
                user: project.owner,
                role: role._id,
                team: project.team_owner,
            };

            await UserProject.addMemberToProject(member, project._id);
            return project;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    editProject: async (projectId, input) => {
        let project;
        try {
            input.updated_at = new Date();
            let inputData = { ...input };
            if ('tag' in inputData) {
                inputData.tag = ObjectID(inputData.tag._id);
            }
            project = await crudHelper.edit(
                collection,
                projectId,
                inputData,
                'project'
            );
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
        return project;
    },

    deleteProject: async (projectId, teamId) => {
        let removed = await Team.removeProject(teamId, projectId);
        if (removed) {
            await crudHelper.delete(collection, projectId, 'project');
        }
        return projectId;
    },
};
