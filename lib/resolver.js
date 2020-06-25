'use strict';

const userResolver = require('./users/user-resolver');
const teamResolver = require('./teams/team-resolver');
const resolvers = {
    ...userResolver,
    ...teamResolver,
};

module.exports = resolvers;
