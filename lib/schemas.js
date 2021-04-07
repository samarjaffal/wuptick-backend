const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolver');

let authTypeDef = require('./auth/auth-schema');
let userTypeDef = require('./users/user-schema');
let teamTypeDef = require('./teams/team-schema');
let projectTypeDef = require('./projects/project-schema');
let taskTypeDef = require('./tasks/task-schema');
let roleTypeDef = require('./roles/role-schema');
let tagTypeDef = require('./tags/tag-schema');
let moduleTypeDef = require('./modules/module-schema');
let topicTypeDef = require('./topics/topic-schema');
let linkTypeDef = require('./links/link-schema');
let fileTypeDef = require('./files/file-schema');
let commentTypeDef = require('./comments/comment-schema');
let invitationTypeDef = require('./invitations/invitation-schema');
let notificationTypeDef = require('./notifications/notification-schema');

const schemas = makeExecutableSchema({
    typeDefs: [
        authTypeDef,
        userTypeDef,
        teamTypeDef,
        projectTypeDef,
        taskTypeDef,
        roleTypeDef,
        tagTypeDef,
        moduleTypeDef,
        topicTypeDef,
        linkTypeDef,
        fileTypeDef,
        commentTypeDef,
        invitationTypeDef,
        notificationTypeDef,
    ],
    resolvers: resolvers,
});

module.exports = schemas;
