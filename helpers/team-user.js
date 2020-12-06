const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const UserProject = require('./user-project');
const mongoHelper = require('./mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    addUserToTeam: async (userId, teamId) => {
        let updatedUserTeamID, updatedTeamMembersId;
        try {
            //add teamId to teams array in user if teams not exists
            updatedUserTeamID = await mongoHelper.addUniqueElementToArray(
                'users',
                ObjectID(userId),
                'teams',
                ObjectID(teamId)
            );

            //add userID to members array in teams if user not exists
            updatedTeamMembersId = await mongoHelper.addUniqueElementToArray(
                'teams',
                ObjectID(teamId),
                'members',
                ObjectID(userId)
            );
        } catch (error) {
            console.log(error);
            throw new Error('Error adding user to a Team', error);
        }
    },

    addNewMember: async (userId, teamId, projectId) => {
        try {
            await module.exports.addUserToTeam(String(userId), String(teamId));

            let role = await mongoDB.findOne('roles', {
                name: 'member',
            });

            let member = {
                user: userId,
                role: role._id,
                team: ObjectID(teamId),
            };
            let memberAdded = await UserProject.addMemberToProject(
                member,
                String(projectId)
            );
            console.log(memberAdded, 'memberAdded');
            return member;
        } catch (error) {
            console.log(error, 'error');
            throw new Error(error);
        }
    },

    test: () => {
        console.log('test samar');
    },
};
