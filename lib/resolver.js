'use strict';

const userResolver = require('./users/user-resolver');
const teamResolver = require('./teams/team-resolver');
const projectResolver = require('./projects/project-resolver');
const moduleResolver = require('./modules/module-resolver');
const taskResolver = require('./tasks/task-resolver');

const resolvers = {
    Query: {
        ...userResolver.Query,
        ...teamResolver.Query,
        ...projectResolver.Query,
        ...moduleResolver.Query,
        ...taskResolver.Query,
    },
    Mutation: {
        ...userResolver.Mutation,
        ...teamResolver.Mutation,
        ...projectResolver.Mutation,
        ...moduleResolver.Mutation,
        ...taskResolver.Mutation,
    },
    ...userResolver.Types,
    ...teamResolver.Types,
    ...projectResolver.Types,
    ...moduleResolver.Types,
    ...taskResolver.Types,
};

module.exports = resolvers;
