'use strict';

const userResolver = require('./users/user-resolver');
const teamResolver = require('./teams/team-resolver');
const projectResolver = require('./projects/project-resolver');
const moduleResolver = require('./modules/module-resolver');

const resolvers = {
    Query: {
        ...userResolver.Query,
        ...teamResolver.Query,
        ...projectResolver.Query,
        ...moduleResolver.Query,
    },
    Mutation: {
        ...userResolver.Mutation,
        ...teamResolver.Mutation,
        ...projectResolver.Mutation,
        ...moduleResolver.Mutation,
    },
    ...userResolver.Types,
    ...teamResolver.Types,
    ...projectResolver.Types,
    ...moduleResolver.Types,
};

module.exports = resolvers;
