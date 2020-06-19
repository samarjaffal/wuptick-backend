const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolver');

let userTypeDef = require('./users/user-schema');
let teamTypeDef = require('./teams/team-schema');

const schemas = makeExecutableSchema({
    typeDefs: [userTypeDef, teamTypeDef],
    resolvers: resolvers,
});

module.exports = schemas;
