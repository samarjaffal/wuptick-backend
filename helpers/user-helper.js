const MongoLib = require('../lib/db/mongo');
const { ObjectID } = require('mongodb');
const mongoDB = new MongoLib();
const mongoHelper = require('./mongo-helper');
const Project = require('./project-helper');

const getUserInfo = async (userId) => {
    try {
        let user = await mongoDB.get('users', userId);
        return user || null;
    } catch (error) {
        console.log(error);
    }
};

const addUserToTeam = async (userId, teamId) => {
    let updatedUserTeamID, updatedTeamMembersId;
    try {
        //add teamId to teams array in user if teams not exists
        updatedUserTeamID = await mongoHelper.addUniqueElementToArray(
            'users',
            userId,
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
        throw new Error('Error addind user to a Team', error);
    }
};

const addNewMember = async (userId, teamId, projectId) => {
    try {
        await addUserToTeam(String(userId), String(teamId));

        let role = await mongoDB.findOne('roles', {
            name: 'member',
        });

        let member = {
            user: userId,
            role: role._id,
            team: ObjectID(teamId),
        };
        let memberAdded = await Project.addMemberToProject(
            member,
            String(projectId)
        );
        console.log(memberAdded, 'memberAdded');
        return member;
    } catch (error) {
        throw new Error(error);
    }
};

module.exports = { getUserInfo, addUserToTeam, addNewMember };
