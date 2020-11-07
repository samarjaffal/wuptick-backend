'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'user_invitations';
const mongoDB = new MongoLib();

const status = {
    invited: 'invited',
    cancelled: 'cancelled',
    registered: 'registered',
};

module.exports = {
    getInvitationsForProject: async (root, { projectId }, context) => {
        let invitations;
        if (!context.isAuth) {
            return null;
        }
        try {
            invitations = await mongoDB.getAll(collection, {
                projectId: ObjectID(projectId),
                status: status.invited,
            });
        } catch (error) {
            console.error(error);
        }

        return invitations || [];
    },
};
