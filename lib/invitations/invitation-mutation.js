'use strict';
const MongoLib = require('../db/mongo');
const { ObjectID } = require('mongodb');
const collection = 'user_invitations';
const crudHelper = require('../../helpers/crud-helper');
const mongoDB = new MongoLib();

module.exports = {
    removeInvitation: async (root, { invitationId }, context) => {
        let invitation;
        if (!context.isAuth) {
            return null;
        }

        invitation = await mongoDB.get(collection, invitationId);

        await crudHelper.delete(collection, invitationId, 'invitation');
        return invitation;
    },
};
