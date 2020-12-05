const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoHelper = require('./mongo-helper');
const crudHelper = require('./crud-helper');

const collection = 'teams';
const mongoDB = new MongoLib();

module.exports = {
    addProject: async (teamId, projectId) => {
        try {
            let updatedId;
            //add teamId to teams array in user if teams not exists
            updatedId = await mongoHelper.addUniqueElementToArray(
                collection,
                teamId,
                'projects',
                ObjectID(projectId)
            );
            return updatedId;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    removeProject: async (teamId, projectId) => {
        let removedId;
        const operator = { projects: ObjectID(projectId) };
        removedId = await crudHelper.removeSet(
            collection,
            teamId,
            'team',
            operator
        );
        return removedId;
    },

    removeMemberFromTeam: async (teamId, userId) => {
        let projectIds, team;

        try {
            team = await mongoDB.get(collection, teamId);

            if (!team) {
                return false;
            }

            if ('projects' in team && team.projects.length > 0) {
                projectIds = [...team.projects];

                if (projectIds.length > 0) {
                    let query = { _id: { $in: projectIds } };
                    let operator = {
                        $pull: { members: { user: ObjectID(userId) } },
                    };
                    await mongoDB.updateMany('projects', query, operator);
                }
            }

            await crudHelper.removeSet('users', userId, 'users', {
                teams: ObjectID(teamId),
            });

            await crudHelper.removeSet(collection, teamId, 'teams', {
                members: ObjectID(userId),
            });

            return true;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },

    deleteTeam: async (teamId) => {
        let team, members, projectIds;

        try {
            team = await mongoDB.get(collection, ObjectID(teamId));

            if (!team) {
                return false;
            }

            if ('projects' in team && team.projects.length > 0) {
                projectIds = [...team.projects];
                if (projectIds.length > 0) {
                    let query = { _id: { $in: projectIds } };
                    await mongoDB.deleteMany('projects', query);
                }
            }

            if ('members' in team && team.members.length > 0) {
                members = [...team.members];

                if (members.length > 0) {
                    let query = { _id: { $in: members } };
                    let operator = {
                        $pull: { teams: ObjectID(teamId) },
                    };
                    await mongoDB.updateMany('users', query, operator);
                }
            }

            await mongoDB.delete(collection, teamId);
            return true;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
};
