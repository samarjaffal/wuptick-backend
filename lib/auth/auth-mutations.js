'use strict';
const MongoLib = require('../db/mongo');
const collection = 'users';
const mongoDB = new MongoLib();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crudHelper = require('../../helpers/crud-helper');
const User = require('../../helpers/user-helper');
const { ObjectID } = require('mongodb');
const { sendRefreshToken } = require('../../shared/tokens');
const { userLoader } = require('../db/dataLoaders');
const { newMemberToProject } = require('../../email/project-email');
const { sendInvitationToRegister } = require('../../email/user-email');

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
    register: async (_, { input }, context) => {
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
                /*   input.password = hashedPassword; */
                let tempInput = {
                    email: input.email,
                    password: hashedPassword,
                };
                user = await crudHelper.create(collection, tempInput, defaults);
                if (input.token) {
                    let decodedToken = jwt.decode(input.token);
                    const { projectId, teamId } = decodedToken;
                    if (projectId !== null && teamId !== null) {
                        await User.addNewMember(user._id, teamId, projectId);
                    }
                }

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
        let user;

        try {
            //check if user exist first
            user = await mongoDB.findOne(collection, { email });

            if (user) {
                let userId = user._id;

                let newMember = await User.addNewMember(
                    userId,
                    teamId,
                    projectId
                );

                if (newMember) {
                    //send email to user that has joinded a new project.
                    newMemberToProject(email, projectId);
                }
                return user;
            }

            //send invitation to register for a user
            let data = { email, projectId, teamId };
            sendInvitationToRegister(data);
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
};
