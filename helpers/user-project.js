const { ObjectID } = require('mongodb');
const mongoHelper = require('./mongo-helper');

module.exports = {
    addMemberToProject: async (member, projectId) => {
        try {
            projectId = String(projectId);

            let memberId = await mongoHelper.addUniqueElementToArray(
                'projects',
                ObjectID(projectId),
                'members',
                member
            );

            return memberId || null;
        } catch (error) {
            console.log(error);
            throw new Error(error);
        }
    },
};
