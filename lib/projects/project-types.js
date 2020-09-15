'use strict';
const MongoLib = require('../db/mongo');
const { GraphQLDateTime } = require('graphql-iso-date');
const { ObjectID } = require('mongodb');
const mongoHelper = require('../../helpers/mongo-helper');
const { userLoader, teamLoader } = require('../db/dataLoaders');
const mongoDB = new MongoLib();

module.exports = {
    DateTime: GraphQLDateTime || null,
    Project: {
        owner: async ({ owner }) => {
            let userData;
            try {
                if (!owner) return null;
                /* userData = await mongoDB.get('users', owner); */
                userData = await userLoader.loadMany([owner]);
            } catch (error) {
                console.error(error);
            }
            return userData;
        },

        team_owner: async ({ team_owner }) => {
            let team;
            try {
                if (!team_owner) return null;
                /* team = await mongoDB.get('teams', team_owner); */
                team = await teamLoader.loadMany([team_owner]);
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

                /* usersData = await mongoHelper.getAllDocuments('users', userIds); */
                usersData = await userLoader.loadMany(userIds);
                rolesData = await mongoHelper.getAllDocuments('roles', roleIds);
                /* teamsData = await mongoHelper.getAllDocuments('teams', teamIds); */
                teamsData = await teamLoader.loadMany(teamIds);

                data = members.map((member) => {
                    let user = usersData.find((data) =>
                        data._id.equals(member.user)
                    );
                    let role = rolesData.find((data) =>
                        data._id.equals(member.role)
                    );
                    let team = teamsData.find((data) =>
                        data._id.equals(member.team)
                    );

                    let newObject = { user, role, team };
                    return newObject;
                });
            } catch (error) {
                console.error(error);
            }

            return data;
        },
    },
};
