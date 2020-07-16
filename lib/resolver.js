'use strict';

const userResolver = require('./users/user-resolver');
const teamResolver = require('./teams/team-resolver');
const projectResolver = require('./projects/project-resolver');
const moduleResolver = require('./modules/module-resolver');
const taskResolver = require('./tasks/task-resolver');
const topicResolver = require('./topics/topic-resolver');
const linkResolver = require('./links/link-resolver');
const fileResolver = require('./files/files-resolver');
const commentResolver = require('./comments/comment-resolver');
const tagResolver = require('./tags/tag-resolver');
const roleResolver = require('./roles/role-resolver');
const authResolver = require('./auth/auth-resolver');

const resolvers = {
    Query: {
        ...userResolver.Query,
        ...teamResolver.Query,
        ...projectResolver.Query,
        ...moduleResolver.Query,
        ...taskResolver.Query,
        ...topicResolver.Query,
        ...linkResolver.Query,
        ...fileResolver.Query,
        ...commentResolver.Query,
        ...tagResolver.Query,
        ...roleResolver.Query,
        ...authResolver.Query,
    },
    Mutation: {
        ...userResolver.Mutation,
        ...teamResolver.Mutation,
        ...projectResolver.Mutation,
        ...moduleResolver.Mutation,
        ...taskResolver.Mutation,
        ...topicResolver.Mutation,
        ...linkResolver.Mutation,
        ...fileResolver.Mutation,
        ...commentResolver.Mutation,
        ...tagResolver.Mutation,
        ...roleResolver.Mutation,
        ...authResolver.Mutation,
    },
    ...userResolver.Types,
    ...teamResolver.Types,
    ...projectResolver.Types,
    ...moduleResolver.Types,
    ...taskResolver.Types,
    ...topicResolver.Types,
    ...linkResolver.Types,
    ...fileResolver.Types,
    ...commentResolver.Types,
    ...tagResolver.Types,
    ...roleResolver.Types,
};

module.exports = resolvers;
