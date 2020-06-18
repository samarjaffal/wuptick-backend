const { makeExecutableSchema } = require('graphql-tools');
const resolvers = require('./resolver');

let userTypeDef = require('./users/user-types');

const schemas = makeExecutableSchema({
    typeDefs: [userTypeDef],
    resolvers: resolvers,
});

module.exports = schemas;
