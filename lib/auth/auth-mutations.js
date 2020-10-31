'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const bcrypt = require('bcrypt');

const crudHelper = require('../../helpers/crud-helper');
const { sendRefreshToken } = require('../../shared/tokens');
const { userLoader } = require('../db/dataLoaders');
const mongoHelper = require('../../helpers/mongo-helper');

const collection = 'users';
const mongoDB = new MongoLib();

const defaults = {
    last_name: '',
    occupation: '',
    birthday: null,
    avatar: '',
    status: 'active',
    level: 'user',
    confirmed: false,
    tk_version: 0,
};

module.exports = {
    register: async (_, { input }) => {
        let user, ifExist;

        ifExist = await mongoDB.getAll(
            collection,
            { email: input.email },
            true
        );

        if (ifExist) {
            return {
                __typename: 'AuthUserExistError',
                message: 'User exists already.',
            };
        }

        return bcrypt
            .hash(input.password, 12)
            .then(async (hashedPassword) => {
                input.password = hashedPassword;
                user = await crudHelper.create(collection, input, defaults);
                return {
                    __typename: 'User',
                    ...user,
                    password: null,
                };
            })
            .catch((error) => {
                throw error;
            });
    },

    logout: (_, {}, context) => {
        //create and send an empty refresh Token
        sendRefreshToken(context.res, '');
        return true;
    },

    changePassword: async (_, { oldPassword, newPassword }, context) => {
        let user;
        if (!context.isAuth) {
            return {
                __typename: 'ChangePassword',
                _id: context._id,
                password: false,
            };
        }

        user = await userLoader.load(ObjectID(context._id));

        if (!user) {
            return {
                __typename: 'AuthUserError',
                message: 'User not found!',
            };
        }

        const isEqual = await bcrypt.compare(oldPassword, user.password);

        if (!isEqual) {
            return {
                __typename: 'OldPasswordError',
                message: 'The old password you provided is not correct!',
            };
        }

        return bcrypt
            .hash(newPassword, 12)
            .then(async (hashedPassword) => {
                newPassword = hashedPassword;
                await mongoDB.update('users', user._id, {
                    password: hashedPassword,
                });
                return {
                    __typename: 'ChangePassword',
                    _id: user._id,
                    password: true,
                };
            })
            .catch((error) => {
                throw error;
            });
    },

    registerUserByInvitation: async (
        _,
        { email, projectId, teamId },
        context
    ) => {
        let user, data, query;

        try {
            //check if user exist first
            user = await mongoDB.findOne(collection, { email });

            if (user) {
                let userId = user._id;

                //add teamId to teams array in user if teams not exists
                let updatedUserTeamID = await mongoHelper.addUniqueElementToArray(
                    collection,
                    userId,
                    'teams',
                    ObjectID(teamId)
                );

                /* console.log(updatedUserTeamID, 'updatedUserTeamID'); */

                //add userID to members array in teams if user not exists
                let updatedTeamMembersId = await mongoHelper.addUniqueElementToArray(
                    'teams',
                    ObjectID(teamId),
                    'members',
                    userId
                );

                /* console.log(updatedTeamMembersId, 'updatedTeamMembersId'); */

                let role = await mongoDB.findOne('roles', {
                    name: 'member',
                });

                //add userID to members array in projects if user not exists
                let newProjectMember = {
                    user: user._id,
                    role: role._id,
                    team: ObjectID(teamId),
                };

                let addedProjectMemberID = await mongoHelper.addUniqueElementToArray(
                    'projects',
                    ObjectID(projectId),
                    'members',
                    newProjectMember
                );
                /*              console.log(addedProjectMemberID, 'addedProjectMemberID'); */

                //send email to user that has joinded a new project.
                console.log('end');
                return user;
            }

            //if not exist do something
            //generate an url invitation with jwt
            //send email to user with url
            //when user clicks on url it will redirect to register page
            //user logs in
            //then user it's added to the team and the project
        } catch (error) {
            console.log(error);
        }
    },
};
