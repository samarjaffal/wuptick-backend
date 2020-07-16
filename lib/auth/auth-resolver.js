'use strict';

const queries = require('./auth-queries');

const authResolver = {
    Query: queries,
    Mutation: {},
    Types: {},
};

delete authResolver.kind;
delete authResolver.loc;
delete authResolver.definitions;

module.exports = authResolver;
