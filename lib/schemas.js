const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolver');

let userTypeDef = require('./users/user-schema');
let teamTypeDef = require('./teams/team-schema');
let projectTypeDef = require('./projects/project-schema');

const schemas = makeExecutableSchema({
    typeDefs: [userTypeDef, teamTypeDef, projectTypeDef],
    resolvers: resolvers,
});

module.exports = schemas;
