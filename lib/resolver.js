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
const invitationResolver = require('./invitations/invitation-resolver');
const notificationResolver = require('./notifications/notification-resolver');
const settingResolver = require('./settings/setting-resolver');

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
        ...invitationResolver.Query,
        ...notificationResolver.Query,
        ...settingResolver.Query,
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
        ...invitationResolver.Mutation,
        ...notificationResolver.Mutation,
        ...settingResolver.Mutation,
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
    ...invitationResolver.Types,
    ...notificationResolver.Types,
    ...settingResolver.Types,
};

module.exports = resolvers;
