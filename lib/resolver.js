'use strict';

const userResolver = require('./users/user-resolver');
const teamResolver = require('./teams/team-resolver');
const projectResolver = require('./projects/project-resolver');

const resolvers = {
    ...userResolver,
    ...teamResolver,
    ...projectResolver,
};

module.exports = resolvers;
