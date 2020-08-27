'use strict';
const MongoLib = require('../db/mongo');
const { GraphQLDateTime } = require('graphql-iso-date');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');

const mongoDB = new MongoLib();

module.exports = {
    DateTime: GraphQLDateTime || null,
    Project: {
        owner: async ({ owner }) => {
            let userData;
            try {
                if (!owner) return null;
                userData = await mongoDB.get('users', owner);
            } catch (error) {
                console.error(error);
            }
            return userData;
        },

        team_owner: async ({ team_owner }) => {
            let team;
            try {
                if (!team_owner) return null;
                team = await mongoDB.get('teams', team_owner);
            } catch (error) {
                console.error(error);
            }
            return team;
        },

        tag: async ({ tag }) => {
            let data;
            try {
                if (!tag) return null;
                if ('_id' in tag) {
                    tag = ObjectID(tag._id);
                }
                data = await mongoDB.get('tags', tag);
            } catch (error) {
                console.error(error);
            }
            return data;
        },

        members: async ({ members }) => {
            let userIds, roleIds, teamIds;
            let usersData, rolesData, teamsData;
            let user, role, team;
            let data = {};
            try {
                userIds =
                    members.length > 0
                        ? members.map((object) => ObjectID(object.user))
                        : [];
                roleIds =
                    members.length > 0
                        ? members.map((object) => ObjectID(object.role))
                        : [];
                teamIds =
                    members.length > 0
                        ? members.map((object) => ObjectID(object.team))
                        : [];

                usersData = await mongoHelper.getAllDocuments('users', userIds);
                rolesData = await mongoHelper.getAllDocuments('roles', roleIds);
                teamsData = await mongoHelper.getAllDocuments('teams', teamIds);

                user = mongoHelper.FindObjectDataFromArrayWithID(
                    usersData,
                    members,
                    'user',
                    '_id'
                );
                role = mongoHelper.FindObjectDataFromArrayWithID(
                    rolesData,
                    members,
                    'role',
                    '_id'
                );
                team = mongoHelper.FindObjectDataFromArrayWithID(
                    teamsData,
                    members,
                    'team',
                    '_id'
                );

                if (Object.keys(user).length > 0) {
                    data.user = user;
                }
                if (Object.keys(role).length > 0) {
                    data.role = role;
                }
                if (Object.keys(team).length > 0) {
                    data.team = team;
                }
            } catch (error) {
                console.error(error);
            }

            return [{ ...data }];
        },
    },
};
