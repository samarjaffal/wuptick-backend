const MongoLib = require('../lib/db/mongo');
const mongoDB = new MongoLib();
const collection = 'user_invitations';

const status = {
    invited: 'invited',
    cancelled: 'cancelled',
    registered: 'registered',
};

const defaults = {
    email: '',
    created_at: '',
    updated_at: null,
    status: status.invited,
};

module.exports = {
    createInvitation: async (data) => {
        try {
            let newData = { ...defaults, ...data };
            let invitationId = await mongoDB.create(collection, newData);
            return { ...newData, _id: invitationId } || null;
        } catch (error) {
            throw new Error(error);
        }
    },

    acceptInvitation: async (email) => {
        try {
            let result = await mongoDB.updateOne(
                collection,
                { email },
                {
                    status: status.registered,
                    updated_at: new Date(),
                }
            );
            return result ? true : false;
        } catch (error) {
            throw new Error(error);
        }
    },
};
