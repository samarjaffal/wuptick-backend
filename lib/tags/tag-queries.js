'use strict';
const Tag = require('../../helpers/tag');

module.exports = {
    getTags: async (_, { teamId }, context) => {
        if (!context.isAuth) {
            return null;
        }
        return await Tag.getTags(teamId);
    },
};
