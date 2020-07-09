const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolver');

let userTypeDef = require('./users/user-schema');
let teamTypeDef = require('./teams/team-schema');
let projectTypeDef = require('./projects/project-schema');
let taskTypeDef = require('./tasks/task-schema');
let roleTypeDef = require('./roles/role-schema');
let tagTypeDef = require('./tags/tag-schema');
let moduleTypeDef = require('./modules/module-schema');
let topicTypeDef = require('./topics/topic-schema');

const schemas = makeExecutableSchema({
    typeDefs: [
        userTypeDef,
        teamTypeDef,
        projectTypeDef,
        taskTypeDef,
        roleTypeDef,
        tagTypeDef,
        moduleTypeDef,
        topicTypeDef,
    ],
    resolvers: resolvers,
});

module.exports = schemas;
